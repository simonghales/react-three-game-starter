import {createContext, useContext} from "react";
import {ValidUUID} from "../../../utils/ids";
import {CollisionEventProps} from "../../data";

export type CollisionsProviderContextState = {
    addCollisionHandler: (started: boolean, uuid: ValidUUID, callback: (data: any, fixtureIndex: number, isSensor: boolean) => void) => void,
    removeCollisionHandler: (started: boolean, uuid: ValidUUID) => void,
    handleBeginCollision: (data: CollisionEventProps) => void,
    handleEndCollision: (data: CollisionEventProps) => void,
}

export const CollisionsProviderContext = createContext(null as unknown as CollisionsProviderContextState)

export const useCollisionsProviderContext = (): CollisionsProviderContextState => {
    return useContext(CollisionsProviderContext)
}