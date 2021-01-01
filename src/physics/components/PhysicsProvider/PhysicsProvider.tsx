import React, {useCallback, useState} from "react"
import { PhysicsProviderContext } from "./context"
import {WorkerMessageType} from "../../../workers/physics/types";
import {AddBodyProps, RemoveBodyProps, SetBodyProps, UpdateBodyProps} from "../../bodies";
import {Buffers, maxNumberOfDynamicPhysicObjects} from "../../data";

export const useBuffers = () => {
    const [buffers] = useState(() => ({
        positions: new Float32Array(maxNumberOfDynamicPhysicObjects * 2),
        angles: new Float32Array(maxNumberOfDynamicPhysicObjects),
    }))
    return buffers
}

const PhysicsProvider: React.FC<{
    buffers: Buffers,
    worker: Worker | MessagePort,
}> = ({
                                 children,
                                 buffers,
                                 worker}) => {

    const workerAddBody = useCallback((props: AddBodyProps) => {
        worker.postMessage({
            type: WorkerMessageType.ADD_BODY,
            props: props
        })
    }, [])

    const workerRemoveBody = useCallback((props: RemoveBodyProps) => {
        worker.postMessage({
            type: WorkerMessageType.REMOVE_BODY,
            props
        })
    }, [])

    const workerSetBody = useCallback((props: SetBodyProps) => {
        worker.postMessage({
            type: WorkerMessageType.SET_BODY,
            props,
        })
    }, [])

    const workerUpdateBody = useCallback((props: UpdateBodyProps) => {
        worker.postMessage({
            type: WorkerMessageType.UPDATE_BODY,
            props,
        })
    }, [])

    return (
        <PhysicsProviderContext.Provider value={{
            workerAddBody,
            workerRemoveBody,
            workerSetBody,
            workerUpdateBody,
            buffers,
        }}>
            {children}
        </PhysicsProviderContext.Provider>
    )
}

export default PhysicsProvider