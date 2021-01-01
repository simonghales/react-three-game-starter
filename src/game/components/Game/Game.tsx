import React from "react"
import Workers from "../../../components/Workers/Workers";
import GameCanvas from "./components/GameCanvas/GameCanvas";

const Game: React.FC = () => {
    return (
        <Workers>
            <GameCanvas/>
        </Workers>
    )
}

export default Game