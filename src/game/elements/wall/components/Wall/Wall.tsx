import {Box} from "@react-three/drei"
import React from "react"
import {Vec2} from "planck-js";
import {BodyShape, BodyType, useBody} from "react-three-game-engine";
import Bamboo from "../../../../scenery/components/Bamboo/Bamboo";

const Wall: React.FC = () => {

    useBody(() => ({
        type: BodyType.static,
        position: Vec2(0, -3),
        fixtures: [{
            shape: BodyShape.box,
            hx: 2,
            hy: 2,
            fixtureOptions: {},
        }],
    }), {})

    return (
        <>
            <Bamboo width={2} height={2} xPos={0} yPos={-3}/>
        </>
    )

    return (
        <Box args={[2, 2, 2]} position={[0, -3, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={"#3c3762"} />
        </Box>
    )
}

export default Wall