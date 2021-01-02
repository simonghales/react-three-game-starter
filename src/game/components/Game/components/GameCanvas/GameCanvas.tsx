import React from "react"
import PhysicsHandler from "../PhysicsHandler/PhysicsHandler";
import {useWorkersContext, WorkersContext} from "../../../../../components/Workers/context";
import {MessagesContext, useMessagesContext} from "../../../../../components/Messages/context";

const GameCanvas: React.FC = () => {
    const workersContext = useWorkersContext()
    const messagesContext = useMessagesContext()
    return (
        <WorkersContext.Provider value={workersContext}>
            <MessagesContext.Provider value={messagesContext}>
                <PhysicsHandler>
                    <div>
                        GAME!
                    </div>
                </PhysicsHandler>
            </MessagesContext.Provider>
        </WorkersContext.Provider>
    )
}

export default GameCanvas