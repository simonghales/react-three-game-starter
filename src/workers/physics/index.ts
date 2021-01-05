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
import {maxNumberOfDynamicPhysicObjects} from "../../physics/data";

const buffers = {
    positions: new Float32Array(maxNumberOfDynamicPhysicObjects * 2),
    angles: new Float32Array(maxNumberOfDynamicPhysicObjects),
}

const selfWorker = self as unknown as Worker

let logicWorkerPort: MessagePort

let pendingUpdate = false

const sendUpdate = () => {
    const rawMessage = {
        type: WorkerOwnerMessageType.PHYSICS_STEP,
    }
    const {positions, angles} = buffers
    const message = {
        ...rawMessage,
        positions,
        angles,
    }
    if (!(positions.byteLength !== 0 && angles.byteLength !== 0)) {
        pendingUpdate = true
    } else {
        pendingUpdate = false
        selfWorker.postMessage(message, [positions.buffer, angles.buffer])
    }
}

const beginPhysicsLoop = () => {

    setInterval(() => {
        stepWorld()
        const {positions, angles} = buffers

        syncData(positions, angles)

        const rawMessage = {
            type: WorkerOwnerMessageType.PHYSICS_STEP,
        }

        const message = {
            ...rawMessage,
            positions,
            angles,
        }

        if (!(positions.byteLength !== 0 && angles.byteLength !== 0)) {
            pendingUpdate = true
        } else {
            pendingUpdate = false
            selfWorker.postMessage(message, [positions.buffer, angles.buffer])
        }

        if (logicWorkerPort) {
            logicWorkerPort.postMessage(rawMessage)
        }
    }, PHYSICS_UPDATE_RATE)

}

const stepProcessed = (positions: Float32Array, angles: Float32Array) => {
    buffers.positions = positions
    buffers.angles = angles
    if (pendingUpdate) {
        sendUpdate()
    }
}

const init = () => {
    syncBodies()
    initPhysicsListeners()
    beginPhysicsLoop()
}

const step = (positions: Float32Array, angles: Float32Array) => {

    syncData(positions, angles)

    const data: any = {
        type: WorkerOwnerMessageType.FRAME,
        positions,
        angles,
    }

    if (unsyncedBodies) {
        data['bodies'] = dynamicBodiesUuids
        setBodiesSynced()
    }

    selfWorker.postMessage(data, [positions.buffer, angles.buffer])

}

const logicFrame = (positions: Float32Array, angles: Float32Array) => {

    syncData(positions, angles)

    const data: any = {
        type: WorkerOwnerMessageType.FRAME,
        positions,
        angles,
    }

    if (unsyncedLogicBodies) {
        data['bodies'] = dynamicBodiesUuids
        setLogicBodiesSynced()
    }

    logicWorkerPort.postMessage(data, [positions.buffer, angles.buffer])

}

const onMessageFromLogicWorker = (event: MessageEvent) => {

    const {type, props = {}} = event.data as {
        type: WorkerMessageType,
        props: any,
    };
    switch (type) {
        case WorkerMessageType.LOGIC_FRAME:
            const {positions, angles} = event.data
            logicFrame(positions, angles)
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
            stepProcessed(event.data.positions, event.data.angles)
            break;
        case WorkerMessageType.INIT:
            init()
            break;
        case WorkerMessageType.STEP:
            const {positions, angles} = event.data
            step(positions, angles)
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