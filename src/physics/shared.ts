import {World, Vec2, Body} from "planck-js";
import {ValidUUID} from "../utils/ids";

export const planckWorld = World({
    allowSleep: true,
    gravity: Vec2(0, 0),
})


export let unsyncedBodies = false
export let unsyncedLogicBodies = false
export let bodiesLastUpdated = 0

export const updateBodiesLastUpdated = () => {
    bodiesLastUpdated = Date.now()
    unsyncedBodies = true
    unsyncedLogicBodies = true
}

export const setBodiesSynced = () => {
    unsyncedBodies = false
}

export const setLogicBodiesSynced = () => {
    unsyncedLogicBodies = false
}

export const dynamicBodiesUuids: ValidUUID[] = []

export const existingBodies = new Map<string | number, Body>()