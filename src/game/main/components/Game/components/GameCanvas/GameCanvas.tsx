import React from "react"
import GameContents from "../GameContents/GameContents";
import {Canvas} from "react-three-fiber";
import styled from "styled-components";
import InputsHandler from "../InputsHandler/InputsHandler";
import TouchHandler from "../../../TouchHandler/TouchHandler";
import GameEngine from "../GameEngine/GameEngine";

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const GameCanvas: React.FC = () => {
    return (
        <StyledContainer>
            <TouchHandler>
                <Canvas shadowMap concurrent>
                    <GameEngine>
                        <InputsHandler>
                            <GameContents/>
                        </InputsHandler>
                    </GameEngine>
                </Canvas>
            </TouchHandler>
        </StyledContainer>
    )
}

export default GameCanvas