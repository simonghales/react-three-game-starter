import React from "react"
import Lights from "../../../Lights/Lights";
import Floor from "../../../Floor/Floor";
import Wall from "../../../../../elements/wall/components/Wall/Wall";

const GameContents: React.FC = () => {

    return (
        <>
            <Lights/>
            <Floor/>
            <Wall/>
        </>
    )
}

export default GameContents