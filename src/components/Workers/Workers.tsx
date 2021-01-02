import React, {useLayoutEffect, useState} from "react"
import { WorkersContext } from "./context"
import {useMessagesContext} from "../Messages/context";
import {WorkerOwnerMessageType} from "../../workers/physics/types";
import {MessageData} from "../../workers/shared/types";

const Workers: React.FC = ({children}) => {

    const [physicsWorker, setPhysicsWorker] = useState<Worker | null>(null)
    const [logicWorker, setLogicWorker] = useState<Worker | null>(null)

    const {
        handleMessage,
    } = useMessagesContext()

    useLayoutEffect(() => {
        const physWorker = new Worker('../../workers/physics', { name: 'physicsWorker', type: 'module' })
        const logiWorker = new Worker('../../workers/logic', { name: 'logicWorker', type: 'module' })
        setPhysicsWorker(physWorker)
        setLogicWorker(logiWorker)
        const channel = new MessageChannel()
        physWorker.postMessage({command: "connect"}, [channel.port1])
        logiWorker.postMessage({command: "connect"}, [channel.port2])

        logiWorker.onmessage= (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.MESSAGE:
                    handleMessage(event.data.message as MessageData)
                    break;
            }

        }

    }, [])

    if (!physicsWorker || !logicWorker) return null

    return (
        <WorkersContext.Provider value={{
            physicsWorker,
            logicWorker,
        }}>
            {children}
        </WorkersContext.Provider>
    )
}

export default Workers