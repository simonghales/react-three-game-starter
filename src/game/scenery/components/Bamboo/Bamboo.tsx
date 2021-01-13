import React from "react"
import { Instance } from "react-three-game-engine";
import {degToRad} from "../../../../utils/angles";

const Bamboo: React.FC = () => {

    return (
        <>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[1, -2, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[-1, -2, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[0, -2, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[1, -3, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[-1, -3, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[0, -3, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[1, -4, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[-1, -4, 0]}/>
            <Instance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[0, -4, 0]}/>
        </>
    )
}

export default Bamboo