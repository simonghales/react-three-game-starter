import React from "react"
import Lights from "../../../Lights/Lights";
import Floor from "../../../Floor/Floor";
import Wall from "../../../../../elements/wall/components/Wall/Wall";
import Bamboo from "../../../../../scenery/components/Bamboo/Bamboo";

const GameContents: React.FC = () => {

    return (
        <>
            <Lights/>
            <Floor/>
            <Wall/>
            <Bamboo/>
        </>
    )
}

export default GameContents