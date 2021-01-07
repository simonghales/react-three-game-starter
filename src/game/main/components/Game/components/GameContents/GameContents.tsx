import React, {useEffect} from "react"
import Lights from "../../../Lights/Lights";
import { Perf } from 'r3f-perf/dist/r3f-perf.cjs.development.js';
import Floor from "../../../Floor/Floor";
import Wall from "../../../../../elements/wall/components/Wall/Wall";

const GameContents: React.FC = () => {

    return (
        <>
            <Lights/>
            <Floor/>
            <Wall/>
            {/*<Perf />*/}
        </>
    )
}

export default GameContents