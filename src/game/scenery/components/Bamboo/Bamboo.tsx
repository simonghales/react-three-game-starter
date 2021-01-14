import React, {useMemo} from "react"
import { Instance } from "react-three-game-engine";
import random from "canvas-sketch-util/random";
import {degToRad} from "../../../../utils/angles";

const Bamboo: React.FC = () => {

    const bamboo = useMemo(() => {

        const seeded = random.createRandom("")

        const points = []

        const width = 2
        const height = 2

        const area = width * height
        const bambooArea = 0.1 * 0.1
        const freeArea = area / bambooArea;
        const ratio = width / height;
        const count = Math.round(Math.sqrt(Math.round(freeArea)));
        const xCount = Math.round(Math.sqrt(count - ratio));
        const yCount = Math.round(count / xCount);

        for (let x = 0; x < xCount; x++) {
            for (let y = 0; y < yCount; y++) {
                const offset = seeded.noise2D(x, y) / 10;
                const u = xCount <= 1 ? 0.5 : x / (xCount - 1);
                const v = yCount <= 1 ? 0.5 : y / (yCount - 1);
                const xPos = (u + offset) * width
                const yPos = (v + offset) * height
                points.push([xPos, yPos]);
            }
        }

        return points.filter(() => seeded.gaussian() > -2)
    }, [])

    return (
        <>
            {
                bamboo.map(([x, y], index) => {
                    return (
                        <Instance meshKey={"bamboo"} key={index} rotation={[degToRad(90), degToRad(90), 0]} position={[x - 1, y - 4, 0]}/>
                    )
                })
            }
        </>
    )
}

export default Bamboo