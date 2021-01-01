import React from "react"
import PhysicsHandler from "../PhysicsHandler/PhysicsHandler";
import {useWorkersContext, WorkersContext} from "../../../../../components/Workers/context";

const GameCanvas: React.FC = () => {
    const workersState = useWorkersContext()
    return (
        <WorkersContext.Provider value={workersState}>
            <PhysicsHandler>
                <div>
                    GAME!
                </div>
            </PhysicsHandler>
        </WorkersContext.Provider>
    )
}

export default GameCanvas