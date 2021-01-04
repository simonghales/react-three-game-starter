import React from "react"
import PhysicsHandler from "../PhysicsHandler/PhysicsHandler";
import {useWorkersContext, WorkersContext} from "../../../../../../components/Workers/context";
import {MessagesContext, useMessagesContext} from "../../../../../../components/Messages/context";
import GameContents from "../GameContents/GameContents";
import LogicHandler from "../LogicHandler/LogicHandler";
import {Canvas} from "react-three-fiber";
import styled from "styled-components";
import InputsHandler from "../InputsHandler/InputsHandler";
import MeshRefs from "../../../../../meshes/components/MeshRefs/MeshRefs";

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const GameCanvas: React.FC = () => {
    const workersContext = useWorkersContext()
    const messagesContext = useMessagesContext()
    return (
        <StyledContainer>
            <Canvas shadowMap concurrent>
                <MeshRefs>
                    <InputsHandler>
                        <WorkersContext.Provider value={workersContext}>
                            <MessagesContext.Provider value={messagesContext}>
                                <PhysicsHandler>
                                    <LogicHandler>
                                        <GameContents/>
                                    </LogicHandler>
                                </PhysicsHandler>
                            </MessagesContext.Provider>
                        </WorkersContext.Provider>
                    </InputsHandler>
                </MeshRefs>
            </Canvas>
        </StyledContainer>
    )
}

export default GameCanvas