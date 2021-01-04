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


const selfWorker = self as unknown as Worker

let logicWorkerPort: MessagePort

const beginPhysicsLoop = () => {

    setInterval(() => {
        stepWorld()
        const message = {
            type: WorkerOwnerMessageType.PHYSICS_STEP,
        }
        selfWorker.postMessage(message)
        if (logicWorkerPort) {
            logicWorkerPort.postMessage(message)
        }
    }, 1000 / 30)

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