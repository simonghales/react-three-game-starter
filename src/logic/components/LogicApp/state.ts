import {proxy} from "valtio";

export const workerStorage: {
    worker: MessagePort | null,
} = {
    worker: null,
}

export const logicAppState = proxy({
    initiated: false,
    workerLoaded: false,
})