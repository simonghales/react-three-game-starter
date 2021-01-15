import React from "react"
import GameCanvas from "./components/GameCanvas/GameCanvas";
import DevMenu from "../../../../development/components/DevMenu/DevMenu";

const Game: React.FC = () => {
    return (
        <>
            <GameCanvas/>
            <DevMenu/>
        </>
    )
}

export default Game