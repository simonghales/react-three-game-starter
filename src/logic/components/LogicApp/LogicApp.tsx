import React from "react"
import CollisionsProvider from "../../../physics/components/CollisionsProvider/CollisionsProvider";
import {MessageData} from "../../../workers/shared/types";
import LgGame from "./components/LgGame/LgGame";
import LgPhysicsHandler from "./components/LgPhysicsHandler/LgPhysicsHandler";
import WorkerCommunication from "./components/WorkerCommunication/WorkerCommunication";

const LogicApp: React.FC<{
    sendMessageToMain: (message: MessageData) => void,
}> = ({sendMessageToMain}) => {

    return (
        <WorkerCommunication sendMessageToMain={sendMessageToMain}>
            <CollisionsProvider>
                <LgPhysicsHandler>
                    <LgGame/>
                </LgPhysicsHandler>
            </CollisionsProvider>
        </WorkerCommunication>
    )
}

export default LogicApp