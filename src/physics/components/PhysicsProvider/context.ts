import {createContext, useContext} from "react";
import {AddBodyProps, RemoveBodyProps, SetBodyProps, UpdateBodyProps} from "../../bodies";
import {Buffers} from "../../data";

type PhysicsProviderContextState = {
    buffers: Buffers,
    workerAddBody: (props: AddBodyProps) => void,
    workerRemoveBody: (props: RemoveBodyProps) => void,
    workerSetBody: (props: SetBodyProps) => void,
    workerUpdateBody: (props: UpdateBodyProps) => void,
}

export const PhysicsProviderContext = createContext(null as unknown as PhysicsProviderContextState)

export const usePhysicsProvider = (): PhysicsProviderContextState => {
    return useContext(PhysicsProviderContext)
}