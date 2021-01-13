import React, {useMemo, useRef} from "react"
import {degToRad} from "../../../../utils/angles";
import {SingleInstance} from "../../../../temp/instancing/InstancingProvider";

const Bamboo: React.FC = () => {

    return (
        <>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[1, -2, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[-1, -2, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[0, -2, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[1, -3, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[-1, -3, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[0, -3, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[1, -4, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[-1, -4, 0]}/>
            <SingleInstance meshKey={"bamboo"} rotation={[degToRad(90), degToRad(90), 0]} position={[0, -4, 0]}/>
        </>
    )
}

export default Bamboo