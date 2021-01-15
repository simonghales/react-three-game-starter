import { Plane } from "@react-three/drei"
import React, {useCallback, useState} from "react"
import {usePlaneDraw} from "../../../../development/hooks/usePlaneDraw";
import Bamboo from "../../../scenery/components/Bamboo/Bamboo";
import {generatedCode} from "../../../../development/components/GeneratedCode/GeneratedCode";
import reactElementToJSXString from "react-element-to-jsx-string";

const size = 100

type State = {
    startX: number,
    startY: number,
    width: number,
    height: number,
}

const calculateState = (start: [number, number], current: [number, number]): State => {
    const xDiff = current[0] - start[0]
    const yDiff = current[1] - start[1]
    const xOffset = xDiff > 0 ? 1 : -1
    const yOffset = yDiff > 0 ? 1 : -1
    const width = Math.abs(xDiff)
    const height = Math.abs(yDiff)
    return {
        startX: start[0] + (width / 2) * xOffset,
        startY: start[1] + (height / 2) * yOffset,
        width,
        height,
    }
}

const Floor: React.FC = () => {

    const [active, setActive] = useState(false)
    const [state, setState] = useState<State>(calculateState([0, 0], [0, 0]))
    const {width, height, startX, startY} = state

    const onStart = useCallback((position: [number, number]) => {
        setState(calculateState(position, position))
        setActive(true)
    }, [])

    const onEnd = useCallback((end: [number, number], start: [number, number]) => {
        setState(calculateState(start, end))
        setActive(false)
    }, [])

    const onMove = useCallback((position: [number, number], start: [number, number]) => {
        setState(calculateState(start, position))
    }, [])

    const props = usePlaneDraw({
        onStart: onStart,
        onEnd: onEnd,
        onMove: onMove,
    })

    const bamboo = <Bamboo width={width} height={height} xPos={startX} yPos={startY}/>

    generatedCode.code = reactElementToJSXString(bamboo)

    return (
        <>
            <Plane args={[size, size]} receiveShadow {...props}>
                <meshStandardMaterial color={"#3a3a3a"} />
            </Plane>
            {
                active && (
                    <>
                        <Plane args={[width, height]} position={[startX, startY, 0.1]}>
                            <meshStandardMaterial color={"white"} transparent opacity={0.25} />
                        </Plane>
                        {bamboo}
                    </>
                )
            }
            <Bamboo
                height={13.10827226602136}
                width={4.1222560445964795}
                xPos={-6.836678167344699}
                yPos={-1.3340346321199332}
            />

        </>
    )
}

export default Floor