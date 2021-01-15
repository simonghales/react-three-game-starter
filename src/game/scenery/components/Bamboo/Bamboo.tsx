import React, {useMemo} from "react"
import { Instance } from "react-three-game-engine";
import random from "canvas-sketch-util/random";
import {degToRad} from "../../../../utils/angles";
import {lerp} from "../../../../utils/numbers";

const Bamboo: React.FC<{
    width: number,
    height: number,
    xPos: number,
    yPos: number,
}> = ({width, height, xPos, yPos}) => {

    const bamboo = useMemo(() => {

        const seeded = random.createRandom("")

        const points = []

        const margin = 0.1

        const area = width * height
        const bambooArea = 0.2 * 0.2
        const freeArea = (area - Math.pow(margin, 2)) / bambooArea;
        const ratio = width / height;
        const count = Math.round(Math.sqrt(Math.round(freeArea)));
        const xCount = Math.round(Math.sqrt(count - ratio));
        const yCount = Math.round(count / xCount);

        for (let x = 0; x < xCount; x++) {
            for (let y = 0; y < yCount; y++) {
                const offset = seeded.noise2D(x, y) / 7.5;
                const u = xCount <= 1 ? 0.5 : x / (xCount - 1);
                const v = yCount <= 1 ? 0.5 : y / (yCount - 1);
                const xPos = lerp(margin, width - margin, (u + offset))
                const yPos = lerp(margin, height - margin, (v + offset))
                const rotation = lerp(0, Math.PI, seeded.value())
                const scale = lerp(0.95, 1.05, seeded.value())
                points.push([xPos, yPos, rotation, scale]);
            }
        }

        return points.filter(() => seeded.gaussian() > -1.5)
    }, [width, height])

    return (
        <>
            {
                bamboo.map(([x, y, rotation, scale], index) => {
                    return (
                        <Instance meshKey={"bamboo"} key={index} rotation={[degToRad(90), rotation, 0]} position={[x + xPos - (width / 2), y + yPos - (height / 2), 0]} scale={[scale, scale, scale]}/>
                    )
                })
            }
        </>
    )
}

export default Bamboo