import { Plane } from "@react-three/drei"
import React from "react"
import {degToRad} from "../../../../utils/angles";

const size = 100

const Floor: React.FC = () => {

    return (
        <>
            <Plane args={[size, size]} receiveShadow>
                <meshStandardMaterial color={"#3a3a3a"} />
            </Plane>
        </>
    )
}

export default Floor