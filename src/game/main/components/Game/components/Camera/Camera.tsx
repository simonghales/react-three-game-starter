import React, {useEffect, useLayoutEffect, useRef} from "react"
import {useThree} from "react-three-fiber";
import {DirectionalLight, Group, Matrix4, PerspectiveCamera} from "three";
import {useTweaks} from "use-tweaks";

const Camera: React.FC = () => {

    const groupRef = useRef<Group>(null as unknown as Group)
    const lightRef = useRef<DirectionalLight>(null as unknown as DirectionalLight)
    const cameraRef = useRef<PerspectiveCamera>(null as unknown as PerspectiveCamera)
    const {setDefaultCamera} = useThree()

    useLayoutEffect(() => {
        cameraRef.current.up.set(0,0,1);
        cameraRef.current.lookAt(0, 0, 1)
        void setDefaultCamera(cameraRef.current)
    }, [])

    return (
        <group ref={groupRef}>
            <perspectiveCamera ref={cameraRef} position={[15, 15, 30]} fov={25}>
                <directionalLight ref={lightRef}
                                  position={[100, -100, 100]}
                                  intensity={0.4}
                                  castShadow
                                  shadow-mapSize-width={2048}
                                  shadow-mapSize-height={2048} />
            </perspectiveCamera>
        </group>
    )
}

export default Camera