import {proxy} from "valtio";

export const workerStorage: {
    worker: MessagePort | null,
} = {
    worker: null,
}

export const logicAppState = proxy({
    workerLoaded: false,
})