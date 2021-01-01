import {WorkerOwnerMessageType} from "./types";
import {dynamicBodiesUuids, updateBodiesLastUpdated} from "../../physics/shared";

export const logicWorkerStorage: {
    worker: MessagePort | null,
} = {
    worker: null,
}

/* eslint-disable-next-line no-restricted-globals */
const selfWorker = self as unknown as Worker

export const syncBodies = () => {
    updateBodiesLastUpdated()
    /*selfWorker.postMessage(({
        type: WorkerOwnerMessageType.SYNC_BODIES,
        bodies: dynamicBodiesUuids
    }))*/
}

export const sendCollisionBeginEvent = (uuid: string, data: any, fixtureIndex: number, isSensor: boolean) => {

    const update = {
        type: WorkerOwnerMessageType.BEGIN_COLLISION,
        props: {
            uuid,
            data,
            fixtureIndex,
            isSensor,
        }
    }
    selfWorker.postMessage(update)
    if (logicWorkerStorage.worker) {
        logicWorkerStorage.worker.postMessage(update)
    }

}

export const sendCollisionEndEvent = (uuid: string, data: any, fixtureIndex: number, isSensor: boolean) => {

    const update = {
        type: WorkerOwnerMessageType.END_COLLISION,
        props: {
            uuid,
            data,
            fixtureIndex,
            isSensor,
        }
    }
    selfWorker.postMessage(update)
    if (logicWorkerStorage.worker) {
        logicWorkerStorage.worker.postMessage(update)
    }

}