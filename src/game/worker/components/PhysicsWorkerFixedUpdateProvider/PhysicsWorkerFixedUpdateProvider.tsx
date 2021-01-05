import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react"
import {useWorkerOnMessage} from "../WorkerOnMessageProvider/WorkerOnMessageProvider";
import {WorkerOwnerMessageType} from "../../../../workers/physics/types";
import {PHYSICS_UPDATE_RATE} from "../../../../physics/config";

type State = {
    onFixedUpdate: (callback: (delta: number) => void) => () => void,
    getPhysicsStepTimeRemainingRatio: (time: number) => number,
}

const Context = createContext(null as unknown as State)

export const useGetPhysicsStepTimeRemainingRatio = () => {
    return useContext(Context).getPhysicsStepTimeRemainingRatio
}

export const useFixedUpdate = (callback: (delta: number) => void) => {

    const onFixedUpdate = useContext(Context).onFixedUpdate

    useEffect(() => {

        const unsubscribe = onFixedUpdate(callback)

        return () => {
            unsubscribe()
        }

    }, [onFixedUpdate, callback])

}

let count = 0

const reduce = 100000000000

let slow = true

setTimeout(() => {
    slow = false
}, 5000)

const PhysicsWorkerFixedUpdateProvider: React.FC = ({children}) => {

    const lastUpdateRef = useRef(Date.now())
    const countRef = useRef(0)
    const callbacksRef = useRef<{
        [key: string]: (delta: number) => void,
    }>({})

    const getPhysicsStepTimeRemainingRatio = useCallback((previousTime: number) => {
        const nextExpectedUpdate = lastUpdateRef.current + PHYSICS_UPDATE_RATE
        const time = Date.now()
        let ratio = (time - previousTime) / (nextExpectedUpdate - previousTime)
        ratio = ratio > 1 ? 1 : ratio
        ratio = ratio < 0 ? 0 : ratio
        if (slow) {
            return 1
        }
        return ratio
    }, [lastUpdateRef])

    const onFixedUpdate = useCallback((callback: (delta: number) => void) => {

        const key = countRef.current
        countRef.current += 1

        callbacksRef.current[key] = callback

        const unsubscribe = () => {
            delete callbacksRef.current[key]
        }

        return unsubscribe

    }, [callbacksRef])

    const onMessage = useWorkerOnMessage()

    useEffect(() => {

        const onPhysicsStep = () => {

            const lastUpdate = lastUpdateRef.current
            const now = Date.now()
            const delta = !lastUpdate ? 1 / 60 : (now - lastUpdate) / 1000;
            lastUpdateRef.current = now

            const callbacks = callbacksRef.current

            Object.values(callbacks).forEach((callback) => {
                callback(delta)
            })

        }

        const unsubscribe = onMessage((event: MessageEvent) => {

            const type = event.data.type

            if (type === WorkerOwnerMessageType.PHYSICS_STEP) {
                onPhysicsStep()
            }

        })

        return () => {
            unsubscribe()
        }

    }, [onMessage, callbacksRef, lastUpdateRef])

    return (
        <Context.Provider value={{
            onFixedUpdate,
            getPhysicsStepTimeRemainingRatio,
        }}>
            {children}
        </Context.Provider>
    )
}

export default PhysicsWorkerFixedUpdateProvider