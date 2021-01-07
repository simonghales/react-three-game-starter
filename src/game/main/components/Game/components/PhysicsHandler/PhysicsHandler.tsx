import React, {useEffect} from "react"
import {useWorkersContext} from "../../../../../../components/Workers/context";
import PhysicsProvider, {useBuffers} from "../../../../../../physics/components/PhysicsProvider/PhysicsProvider";
import {useCollisionsProviderContext} from "../../../../../../physics/components/CollisionsProvider/context";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../../../../workers/physics/types";
import {storedPhysicsData} from "../../../../../../physics/data";
import CollisionsProvider from "../../../../../../physics/components/CollisionsProvider/CollisionsProvider";
import WorkerOnMessageProvider, {useWorkerOnMessage} from "../../../../../../infrastructure/worker/components/WorkerOnMessageProvider/WorkerOnMessageProvider";
import PhysicsWorkerFixedUpdateProvider from "../../../../../../infrastructure/worker/components/PhysicsWorkerFixedUpdateProvider/PhysicsWorkerFixedUpdateProvider";
import MeshSubscriptions from "../../../../../../infrastructure/worker/components/MeshSubscriptions/MeshSubscriptions";
import MeshLerper from "../../../../../../infrastructure/worker/main/components/MeshLerper/MeshLerper";

const PhysicsHandler: React.FC = ({children}) => {

    const {physicsWorker} = useWorkersContext()
    const buffers = useBuffers()
    const {handleBeginCollision, handleEndCollision} = useCollisionsProviderContext()
    const workerOnMessage = useWorkerOnMessage()

    useEffect(() => {

        physicsWorker.postMessage({
            type: WorkerMessageType.INIT,
            props: {
            }
        })

        const unsubscribe = workerOnMessage((event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.BEGIN_COLLISION:
                    handleBeginCollision(event.data.props as any)
                    break
                case WorkerOwnerMessageType.END_COLLISION:
                    handleEndCollision(event.data.props as any)
                    break
            }

        })

        return () => {
            unsubscribe()
        }

    }, [workerOnMessage])

    return (
        <PhysicsProvider buffers={buffers} worker={physicsWorker}>
            <MeshSubscriptions>
                <PhysicsWorkerFixedUpdateProvider worker={physicsWorker}>
                    <MeshLerper/>
                    {children}
                </PhysicsWorkerFixedUpdateProvider>
            </MeshSubscriptions>
        </PhysicsProvider>
    )
}

const PhysicsWrapper: React.FC = ({children}) => {
    const {physicsWorker} = useWorkersContext()
    return (
        <WorkerOnMessageProvider worker={physicsWorker}>
            <CollisionsProvider>
                <PhysicsHandler>
                    {children}
                </PhysicsHandler>
            </CollisionsProvider>
        </WorkerOnMessageProvider>
    )
}

export default PhysicsWrapper;