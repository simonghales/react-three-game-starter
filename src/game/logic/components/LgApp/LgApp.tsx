import React from "react"
import LgGame from "../LgGame/LgGame";
import {withLogicWrapper} from "react-three-game-engine";

const App: React.FC = () => {
    return (
        <LgGame/>
    )
}

export const LgApp = withLogicWrapper(App)