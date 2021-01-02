import * as React from "react"
import {WorkerCommunicationContext} from "./context";
import {MessageData} from "../../../../../workers/shared/types";

const WorkerCommunication: React.FC<{
    sendMessageToMain: (message: MessageData) => void,
}> = ({children, sendMessageToMain}) => {
    return (
        <WorkerCommunicationContext.Provider value={{sendMessageToMain}}>
            {children}
        </WorkerCommunicationContext.Provider>
    )
}

export default WorkerCommunication