import React, {useEffect, useState} from "react"
import {useSubscribeToMessage} from "../../../../../../components/Messages/context";
import {
    MessageKeys,
    SyncComponentMessage,
    SyncComponentMessageType,
    SyncComponentType,
    ValidProps
} from "../../../../../../workers/shared/types";
import Player from "../../../../../player/main/components/Player/Player";
import {useWorkersContext} from "../../../../../../components/Workers/context";
import {WorkerMessageType} from "../../../../../../workers/physics/types";

const mappedComponentTypes = {
    [SyncComponentType.PLAYER]: Player,
}

const LogicHandler: React.FC = ({children}) => {

    const {logicWorker} = useWorkersContext()

    const subscribeToMessage = useSubscribeToMessage()

    const [components, setComponents] = useState<{
        [key: string]: {
            componentType: SyncComponentType,
            props: ValidProps,
        },
    }>({})

    useEffect(() => {

        logicWorker.postMessage({
            type: WorkerMessageType.INIT,
            props: {}
        })

    }, [logicWorker])

    useEffect(() => {

        const unsubscribe = subscribeToMessage(MessageKeys.SYNC_COMPONENT, (
            {info, messageType, data}: SyncComponentMessage
        ) => {

            const props = data || {}

            switch (messageType) {
                case SyncComponentMessageType.MOUNT:
                    setComponents(state => {
                        return {
                            ...state,
                            [info.componentKey]: {
                                componentType: info.componentType,
                                props,
                            }
                        }
                    })
                    break;
                case SyncComponentMessageType.UPDATE:
                    setComponents(state => {
                        return {
                            ...state,
                            [info.componentKey]: {
                                componentType: info.componentType,
                                props,
                            }
                        }
                    })
                    break;
                case SyncComponentMessageType.UNMOUNT:
                    setComponents(state => {
                        let update = {
                            ...state,
                        }
                        delete update[info.componentKey]
                        return update
                    })
                    break;
            }

        })

        return () => {
            unsubscribe()
        }

    }, [])

    return (
        <>
            {children}
            {
                Object.entries(components).map(([key, {componentType, props}]) => {
                    const Component = mappedComponentTypes[componentType]
                    return Component ? <Component key={key} {...props}/> : null
                })
            }
        </>
    )
}

export default LogicHandler