
export enum MessageKeys {
    SYNC_COMPONENT = 'SYNC_COMPONENT'
}

export type MessageData = {
    key: string,
    data: any,
}

export enum SyncComponentMessageType {
    MOUNT,
    UNMOUNT,
    UPDATE
}

export enum SyncComponentType {
    PLAYER,
}

export type SyncComponentMessageInfo = {
    componentType: SyncComponentType,
    componentKey: string,
}

export type ValidProps = undefined | {
    [key: string]: any,
}

export type SyncComponentMessage = {
    data: ValidProps,
    info: SyncComponentMessageInfo,
    messageType: SyncComponentMessageType,
}