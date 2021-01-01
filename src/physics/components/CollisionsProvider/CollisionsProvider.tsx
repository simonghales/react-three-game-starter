import React, {useCallback, useState} from "react"
import {CollisionsProviderContext} from "./context";
import {ValidUUID} from "../../../utils/ids";
import {CollisionEventProps} from "../../data";

const CollisionsProvider: React.FC = ({children}) => {

    const [collisionStartedEvents] = useState<{
        [key: string]: (data: any, fixtureIndex: number, isSensor: boolean) => void,
    }>({})

    const [collisionEndedEvents] = useState<{
        [key: string]: (data: any, fixtureIndex: number, isSensor: boolean) => void,
    }>({})

    const addCollisionHandler = useCallback((started: boolean, uuid: ValidUUID, callback: (data: any, fixtureIndex: number, isSensor: boolean) => void) => {
        if (started) {
            collisionStartedEvents[uuid] = callback
        } else {
            collisionEndedEvents[uuid] = callback
        }
    }, [])

    const removeCollisionHandler = useCallback((started: boolean, uuid: ValidUUID) => {
        if (started) {
            delete collisionStartedEvents[uuid]
        } else {
            delete collisionEndedEvents[uuid]
        }
    }, [])

    const handleBeginCollision = useCallback((data: CollisionEventProps) => {
        if (collisionStartedEvents[data.uuid]) {
            collisionStartedEvents[data.uuid](data.data, data.fixtureIndex, data.isSensor)
        }
    }, [collisionStartedEvents])

    const handleEndCollision = useCallback((data: CollisionEventProps) => {
        if (collisionEndedEvents[data.uuid]) {
            collisionEndedEvents[data.uuid](data.data, data.fixtureIndex, data.isSensor)
        }
    }, [collisionEndedEvents])

    return (
        <CollisionsProviderContext.Provider value={{
            addCollisionHandler,
            removeCollisionHandler,
            handleBeginCollision,
            handleEndCollision
        }}>
            {children}
        </CollisionsProviderContext.Provider>
    )
}

export default CollisionsProvider