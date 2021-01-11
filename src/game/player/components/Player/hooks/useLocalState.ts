import {useState} from "react";
import {proxy} from "valtio";

export type LocalState = {
    moving: boolean,
}

export const useLocalState = () => {
    const [localState] = useState<LocalState>(() => proxy({
        moving: false,
    }))
    return localState
}