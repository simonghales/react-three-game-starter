import {createContext, useContext} from "react";
import {MessageData} from "../../../../../workers/shared/types";

export type WorkerCommunicationContextState = {
    sendMessageToMain: (message: MessageData) => void,
}

export const WorkerCommunicationContext = createContext(null as unknown as WorkerCommunicationContextState)

export const useWorkerCommunicationContext = (): WorkerCommunicationContextState => {
    return useContext(WorkerCommunicationContext)
}

export const useSendMessageToMain = () => {
    return useWorkerCommunicationContext().sendMessageToMain
}