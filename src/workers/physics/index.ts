/* eslint-disable no-restricted-globals */

import {WorkerMessageType, WorkerOwnerMessageType} from "./types";
import {initPhysicsListeners, stepWorld, syncData} from "../../physics/world";
import {
    dynamicBodiesUuids,
    setBodiesSynced,
    setLogicBodiesSynced,
    unsyncedBodies,
    unsyncedLogicBodies
} from "../../physics/shared";
import {addBody, removeBody, setBody, updateBody} from "../../physics/bodies";
import {logicWorkerStorage, syncBodies} from "./functions";
import {PHYSICS_UPDATE_RATE} from "../../physics/config";
import {maxNumberOfDynamicPhysicObjects, storedPhysicsData} from "../../physics/data";

type Buffers = {
    positions: Float32Array,
    angles: Float32Array,
}

const buffers: Buffers = {
    positions: new Float32Array(maxNumberOfDynamicPhysicObjects * 2),
    angles: new Float32Array(maxNumberOfDynamicPhysicObjects),
}

const logicBuffers: Buffers = {
    positions: new Float32Array(maxNumberOfDynamicPhysicObjects * 2),
    angles: new Float32Array(maxNumberOfDynamicPhysicObjects),
}

const selfWorker = self as unknown as Worker

let logicWorkerPort: MessagePort

let physicsTick = 0
let lastPhysicsUpdate = 0

const sendPhysicsUpdate = (target: Worker | MessagePort, buffer: Buffers, handleBodies: (message: any) => any) => {
    const {positions, angles} = buffer
    if (!(positions.byteLength !== 0 && angles.byteLength !== 0)) {
        return
    }
    syncData(positions, angles)
    const rawMessage: any = {
        type: WorkerOwnerMessageType.PHYSICS_STEP,
        physicsTick,
        physicsUpdate: lastPhysicsUpdate,
    }
    handleBodies(rawMessage)
    const message = {
        ...rawMessage,
        positions,
        angles,
    }
    target.postMessage(message, [positions.buffer, angles.buffer])
}

const sendPhysicsUpdateToLogic = () => {
    sendPhysicsUpdate(logicWorkerPort, logicBuffers, (message: any) => {
        if (unsyncedLogicBodies) {
            message['bodies'] = dynamicBodiesUuids
            setLogicBodiesSynced()
        }
    })
}

const sendPhysicsUpdateToMain = () => {
    sendPhysicsUpdate(selfWorker, buffers, (message: any) => {
        if (unsyncedBodies) {
            message['bodies'] = dynamicBodiesUuids
            setBodiesSynced()
        }
    })
}

const beginPhysicsLoop = () => {

    setInterval(() => {physicsTick += 1
        stepWorld()
        lastPhysicsUpdate = Date.now()
        sendPhysicsUpdateToMain()
        sendPhysicsUpdateToLogic()
    }, PHYSICS_UPDATE_RATE)

}

const stepProcessed = (isMain: boolean, lastProcessedPhysicsTick: number, positions: Float32Array, angles: Float32Array) => {
    const buffer = isMain ? buffers : logicBuffers
    buffer.positions = positions
    buffer.angles = angles
    if (lastProcessedPhysicsTick < physicsTick) {
        if (isMain) {
            sendPhysicsUpdateToMain()
        } else {
            sendPhysicsUpdateToLogic()
        }
    }
}

const init = () => {
    syncBodies()
    initPhysicsListeners()
    beginPhysicsLoop()
}

const onMessageFromLogicWorker = (event: MessageEvent) => {

    const {type, props = {}} = event.data as {
        type: WorkerMessageType,
        props: any,
    };
    switch (type) {
        case WorkerMessageType.PHYSICS_STEP_PROCESSED:
            stepProcessed(false, event.data.physicsTick, event.data.positions, event.data.angles)
            break;
        case WorkerMessageType.ADD_BODY:
            addBody(props)
            break;
        case WorkerMessageType.REMOVE_BODY:
            removeBody(props)
            break;
        case WorkerMessageType.SET_BODY:
            setBody(props)
            break;
        case WorkerMessageType.UPDATE_BODY:
            updateBody(props)
            break;
    }

};

selfWorker.onmessage = (event: MessageEvent) => {

    if (event.data.command) {
        if (event.data.command === "connect") {
            logicWorkerPort = event.ports[0];
            logicWorkerStorage.worker = logicWorkerPort
            logicWorkerPort.onmessage = onMessageFromLogicWorker;
            return
        } else if (event.data.command === "forward") {
            // Forward messages to worker 2
            logicWorkerPort.postMessage( event.data.message )
            return
        }
    }

    const {type, props = {}} = event.data as {
        type: WorkerMessageType,
        props: any,
    };
    switch (type) {
        case WorkerMessageType.PHYSICS_STEP_PROCESSED:
            stepProcessed(true, event.data.physicsTick, event.data.positions, event.data.angles)
            break;
        case WorkerMessageType.INIT:
            init()
            break;
        case WorkerMessageType.ADD_BODY:
            addBody(props)
            break;
        case WorkerMessageType.REMOVE_BODY:
            removeBody(props)
            break;
        case WorkerMessageType.SET_BODY:
            setBody(props)
            break;
        case WorkerMessageType.UPDATE_BODY:
            updateBody(props)
            break;
    }
}

export {}