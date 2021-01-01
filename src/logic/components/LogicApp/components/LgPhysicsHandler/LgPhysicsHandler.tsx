import React, {useCallback, useEffect, useState} from "react"
import PhysicsProvider, {useBuffers} from "../../../../../physics/components/PhysicsProvider/PhysicsProvider";
import {useProxy} from "valtio";
import {ValidUUID} from "../../../../../utils/ids";
import {Object3D} from "three";
import {logicAppState, workerStorage} from "../../state";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../../../workers/physics/types";
import {applyPositionAngle, Buffers, storedPhysicsData} from "../../../../../physics/data";
import {useCollisionsProviderContext} from "../../../../../physics/components/CollisionsProvider/context";
import { PhysicsHandlerContext } from "./context";

type MeshSubscription = {
    uuid: ValidUUID,
    object: Object3D,
    includeAngle: boolean,
}

const updateMeshes = (meshSubscriptions: Map<ValidUUID, MeshSubscription>, buffers: Buffers) => {

    meshSubscriptions.forEach(({uuid, object, includeAngle}) => {
        if (object && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[uuid]
            applyPositionAngle(buffers, object, index, includeAngle)
        }
    })

}

const LgPhysicsHandler: React.FC = ({children}) => {

    const buffers = useBuffers()
    const stateProxy = useProxy(logicAppState)
    const [worker, setWorker] = useState<MessagePort | null>(null)
    const workerLoaded = stateProxy.workerLoaded
    const {handleBeginCollision, handleEndCollision} = useCollisionsProviderContext()

    const [meshSubscriptions] = useState(() => new Map<ValidUUID, MeshSubscription>())

    const subscribeMesh = useCallback((uuid: ValidUUID, object: Object3D, includeAngle: boolean) => {
        meshSubscriptions.set(uuid, {
            uuid: uuid,
            object,
            includeAngle
        })
    }, [])

    const unsubscribeMesh = useCallback((key: ValidUUID) => {
        meshSubscriptions.delete(key)
    }, [])

    useEffect(() => {

        if (workerLoaded && workerStorage.worker) {
            setWorker(workerStorage.worker)
        }

    }, [workerLoaded])

    useEffect(() => {

        if (!worker) return

        let lastUpdate = 0
        let lastRequest = 0

        const loop = () => {
            if(buffers.positions.byteLength !== 0 && buffers.angles.byteLength !== 0) {
                lastRequest = Date.now()
                worker.postMessage({ type: WorkerMessageType.LOGIC_FRAME, ...buffers }, [buffers.positions.buffer, buffers.angles.buffer])
            }
        }

        loop()

        worker.onmessage = (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.FRAME:
                    lastUpdate = Date.now()
                    if (event.data.bodies) {
                        storedPhysicsData.bodies = event.data.bodies.reduce(
                            (acc: { [key: string]: number }, id: string) => ({
                                ...acc,
                                [id]: (event.data as any).bodies.indexOf(id)
                            }),
                            {}
                        )
                    }

                    const positions = event.data.positions as Float32Array
                    const angles = event.data.angles as Float32Array
                    buffers.positions = positions
                    buffers.angles = angles

                    updateMeshes(meshSubscriptions, buffers)

                    const timeSinceLastRequest = Date.now() - lastRequest

                    const frameDuration = 1000 / 60

                    if (timeSinceLastRequest >= frameDuration) {
                        loop()
                    } else {
                        const wait = frameDuration - timeSinceLastRequest
                        setTimeout(loop, wait)
                    }

                    break
                case WorkerOwnerMessageType.SYNC_BODIES:
                    storedPhysicsData.bodies = event.data.bodies.reduce(
                        (acc: { [key: string]: number }, id: string) => ({
                            ...acc,
                            [id]: (event.data as any).bodies.indexOf(id)
                        }),
                        {}
                    )
                    break
                case WorkerOwnerMessageType.BEGIN_COLLISION:
                    handleBeginCollision(event.data.props as any)
                    break
                case WorkerOwnerMessageType.END_COLLISION:
                    handleEndCollision(event.data.props as any)
                    break
            }

        }



    }, [worker])

    if (!worker) return null

    return (
        <PhysicsHandlerContext.Provider value={{
            subscribeMesh,
            unsubscribeMesh
        }}>
            <PhysicsProvider worker={worker} buffers={buffers}>
                {children}
            </PhysicsProvider>
        </PhysicsHandlerContext.Provider>
    )

}

export default LgPhysicsHandler