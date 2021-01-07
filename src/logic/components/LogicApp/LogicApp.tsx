import React from "react"
import CollisionsProvider from "../../../physics/components/CollisionsProvider/CollisionsProvider";
import {MessageData} from "../../../workers/shared/types";
import LgGame from "./components/LgGame/LgGame";
import LgPhysicsHandler from "./components/LgPhysicsHandler/LgPhysicsHandler";
import WorkerCommunication from "./components/WorkerCommunication/WorkerCommunication";
import {useProxy} from "valtio";
import {logicAppState} from "./state";
import MeshRefs from "../../../infrastructure/meshes/components/MeshRefs/MeshRefs";
import LgPhysicsWorker from "./components/LgPhysicsWorker/LgPhysicsWorker";

const LogicApp: React.FC<{
    sendMessageToMain: (message: MessageData) => void,
}> = ({sendMessageToMain}) => {

    const initiated = useProxy(logicAppState).initiated

    return (
        <WorkerCommunication sendMessageToMain={sendMessageToMain}>
            {
                initiated && (
                    <LgPhysicsWorker>
                        <CollisionsProvider>
                            <LgPhysicsHandler>
                                <MeshRefs>
                                    <LgGame/>
                                </MeshRefs>
                            </LgPhysicsHandler>
                        </CollisionsProvider>
                    </LgPhysicsWorker>
                )
            }
        </WorkerCommunication>
    )
}

export default LogicApp