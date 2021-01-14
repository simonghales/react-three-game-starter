import {Box} from "@react-three/drei"
import React from "react"
import {Vec2} from "planck-js";
import {BodyShape, BodyType, useBody} from "react-three-game-engine";

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
        <Box args={[2, 2, 2]} position={[0, -3, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={"#3c3762"} />
        </Box>
    )
}

export default Wall