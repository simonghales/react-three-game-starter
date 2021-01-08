import React, {useEffect} from "react"
import Game from "../../game/main/components/Game/Game"
// @ts-ignore
import {Physics} from "r3"

const App: React.FC = () => {

    return (
        <Physics>
            <Game/>
        </Physics>
    )
}

export default App