import React from "react"
import CollisionsProvider from "../../../physics/components/CollisionsProvider/CollisionsProvider";
import {MessageData} from "../../../workers/shared/types";
import LgGame from "./components/LgGame/LgGame";
import LgPhysicsHandler from "./components/LgPhysicsHandler/LgPhysicsHandler";

const LogicApp: React.FC<{
    sendMessageToMain: (message: MessageData) => void,
}> = () => {

    return (
        <>
            <CollisionsProvider>
                <LgPhysicsHandler>
                    <LgGame/>
                </LgPhysicsHandler>
            </CollisionsProvider>
        </>
    )
}

export default LogicApp