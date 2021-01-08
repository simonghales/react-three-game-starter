import React from "react"
import LgGame from "./components/LgGame/LgGame";
import MeshRefs from "../../../infrastructure/meshes/components/MeshRefs/MeshRefs";
import {withLogicWrapper} from "react-three-game-engine";

const App: React.FC = () => {
    return (
        <MeshRefs>
            <LgGame/>
        </MeshRefs>
    )
}

export const LogicApp = withLogicWrapper(App)