import {createContext, useContext} from "react";

export type WorkersContextState = {
    physicsWorker: Worker,
    logicWorker: Worker,
}

export const WorkersContext = createContext(null as unknown as WorkersContextState)

export const useWorkersContext = (): WorkersContextState => {
    return useContext(WorkersContext)
}