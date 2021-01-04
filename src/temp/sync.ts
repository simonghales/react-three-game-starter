import {useCallback, useEffect, useMemo} from "react";
import {useSendSyncComponentMessage} from "../logic/components/LogicApp/components/WorkerCommunication/context";
import {SyncComponentMessageType, SyncComponentType} from "../workers/shared/types";

export const useSyncWithMainComponent = (
    componentType: SyncComponentType,
    componentKey: string,
    initialProps?: any,
) => {

    const sendMessage = useSendSyncComponentMessage()

    const info = useMemo(() => ({
        componentType,
        componentKey
    }), [componentType,  componentKey])

    const updateProps = useCallback((props: any) => {

        sendMessage(SyncComponentMessageType.UPDATE, info, props)

    }, [info])

    useEffect(() => {

        sendMessage(SyncComponentMessageType.MOUNT, info, initialProps)

        return () => {
            sendMessage(SyncComponentMessageType.UNMOUNT, info)
        }

    }, [info])

    return updateProps

}