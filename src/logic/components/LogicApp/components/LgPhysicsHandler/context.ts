import {ValidUUID} from "../../../../../utils/ids";
import {Object3D} from "three";
import {createContext, useContext} from "react";

export type PhysicsHandlerContextState = {
    subscribeMesh: (uuid: ValidUUID, object: Object3D, includeAngle: boolean) => void,
    unsubscribeMesh: (uuid: ValidUUID) => void,
}

export const PhysicsHandlerContext = createContext(null as unknown as PhysicsHandlerContextState)

export const usePhysicsHandlerContext = (): PhysicsHandlerContextState => {
    return useContext(PhysicsHandlerContext)
}