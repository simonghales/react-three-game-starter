import React, {useEffect} from "react"
import {useWorkersContext} from "../../../../../components/Workers/context";
import PhysicsProvider, {useBuffers} from "../../../../../physics/components/PhysicsProvider/PhysicsProvider";
import {useCollisionsProviderContext} from "../../../../../physics/components/CollisionsProvider/context";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../../../workers/physics/types";
import {storedPhysicsData} from "../../../../../physics/data";
import CollisionsProvider from "../../../../../physics/components/CollisionsProvider/CollisionsProvider";

const PhysicsHandler: React.FC = ({children}) => {

    const {physicsWorker} = useWorkersContext()
    const buffers = useBuffers()
    const {handleBeginCollision, handleEndCollision} = useCollisionsProviderContext()

    useEffect(() => {

        const loop = () => {
            if(buffers.positions.byteLength !== 0 && buffers.angles.byteLength !== 0) {
                physicsWorker.postMessage({ type: WorkerMessageType.STEP, ...buffers }, [buffers.positions.buffer, buffers.angles.buffer])
            }
        }

        physicsWorker.postMessage({
            type: WorkerMessageType.INIT,
            props: {
            }
        })

        loop()

        physicsWorker.onmessage = (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.FRAME:

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
                    requestAnimationFrame(loop);
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

    }, [])

    return (
        <PhysicsProvider buffers={buffers} worker={physicsWorker}>
            {children}
        </PhysicsProvider>
    )
}

const PhysicsWrapper: React.FC = ({children}) => {
    return (
        <CollisionsProvider>
            <PhysicsHandler>
                {children}
            </PhysicsHandler>
        </CollisionsProvider>
    )
}

export default PhysicsWrapper;