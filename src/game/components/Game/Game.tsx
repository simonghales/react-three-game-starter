import React from "react"
import Messages from "../../../components/Messages/Messages";
import Workers from "../../../components/Workers/Workers";
import GameCanvas from "./components/GameCanvas/GameCanvas";

const Game: React.FC = () => {
    return (
        <Messages>
            <Workers>
                <GameCanvas/>
            </Workers>
        </Messages>
    )
}

export default Game