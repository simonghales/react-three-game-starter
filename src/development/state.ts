import {proxy, subscribe} from "valtio";
import {get,set} from "local-storage";

const storageKey = 'devState'

type State = {
    editMode: boolean,
}

const getStoredState = (): State => {
    const storedState = get<State>(storageKey)
    return storedState ?? {
        editMode: false,
    }
}

export const devState = proxy(getStoredState())

subscribe(devState, () => {
    set<State>(storageKey, devState)
})