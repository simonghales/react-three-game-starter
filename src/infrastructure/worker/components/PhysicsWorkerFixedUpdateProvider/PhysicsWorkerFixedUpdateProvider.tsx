import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react"
import {useWorkerOnMessage} from "../WorkerOnMessageProvider/WorkerOnMessageProvider";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../../workers/physics/types";
import {PHYSICS_UPDATE_RATE} from "../../../../physics/config";
import {useWorkersContext} from "../../../../components/Workers/context";
import {useUpdateMeshes} from "../MeshSubscriptions/MeshSubscriptions";
import {storedPhysicsData} from "../../../../physics/data";

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

const PhysicsWorkerFixedUpdateProvider: React.FC<{
    worker: Worker | MessagePort,
    noLerping?: boolean,
}> = ({children, worker, noLerping = false}) => {

    const lastUpdateRef = useRef(Date.now())
    const countRef = useRef(0)
    const callbacksRef = useRef<{
        [key: string]: (delta: number) => void,
    }>({})
    const updateMeshes = useUpdateMeshes()

    const getPhysicsStepTimeRemainingRatio = useCallback((previousTime: number) => {
        const nextExpectedUpdate = lastUpdateRef.current + PHYSICS_UPDATE_RATE
        const time = Date.now()
        let ratio = (time - previousTime) / (nextExpectedUpdate - previousTime)
        ratio = ratio > 1 ? 1 : ratio
        ratio = ratio < 0 ? 0 : ratio
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

                const positions = event.data.positions as Float32Array
                const angles = event.data.angles as Float32Array
                updateMeshes(positions, angles, noLerping)
                worker.postMessage({
                    type: WorkerMessageType.PHYSICS_STEP_PROCESSED,
                    positions,
                    angles,
                    physicsTick: event.data.physicsTick as number,
                }, [positions.buffer, angles.buffer])

                // console.timeEnd('physStep')

                if (event.data.bodies) {
                    storedPhysicsData.bodies = event.data.bodies.reduce(
                        (acc: { [key: string]: number }, id: string) => ({
                            ...acc,
                            [id]: (event.data as any).bodies.indexOf(id)
                        }),
                        {}
                    )
                }
                onPhysicsStep()

            }

        })

        return () => {
            unsubscribe()
        }

    }, [onMessage, callbacksRef, lastUpdateRef, worker, updateMeshes, noLerping])

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