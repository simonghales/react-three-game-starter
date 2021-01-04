import {createContext, useCallback, useContext} from "react";
import {MessageData, MessageKeys, SyncComponentMessageInfo, SyncComponentMessageType} from "../../../../../workers/shared/types";

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

export const useSendSyncComponentMessage = () => {
    const sendMessageRaw = useSendMessageToMain()

    const sendMessage = useCallback((messageType: SyncComponentMessageType, info: SyncComponentMessageInfo, data?: any) => {

        sendMessageRaw({
            key: MessageKeys.SYNC_COMPONENT,
            data: {
                messageType,
                info,
                data,
            },
        })

    }, [sendMessageRaw])

    return sendMessage

}