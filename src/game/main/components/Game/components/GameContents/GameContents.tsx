import React from "react"
import Lights from "../../../Lights/Lights";
import Floor from "../../../Floor/Floor";
import Wall from "../../../../../elements/wall/components/Wall/Wall";
import Bamboo from "../../../../../scenery/components/Bamboo/Bamboo";
import { Perf } from "r3f-perf";

const GameContents: React.FC = () => {

    return (
        <>
            <Lights/>
            <Floor/>
            <Wall/>
            <Bamboo/>
            <Perf/>
        </>
    )
}

export default GameContents