import { Cylinder } from "@react-three/drei"
import React from "react"

const Character: React.FC = () => {

    return (
        <Cylinder args={[0.5, 0.5, 1.25, 20]} position={[0, 1.25 / 2, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={"#345e78"} />
        </Cylinder>
    )
}

export default Character