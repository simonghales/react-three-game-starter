import React, {useEffect, useLayoutEffect, useRef} from "react"
import {useThree} from "react-three-fiber";
import {
    CameraHelper,
    DirectionalLight,
    DirectionalLightHelper,
    Group,
    Matrix4,
    Object3D,
    PerspectiveCamera
} from "three";
import {useTweaks} from "use-tweaks";
import {useFollow} from "./hooks/useFollow";
import {useHelper} from "@react-three/drei";
import ShadowHelper from "./ShadowHelper";
import {useWindowSize} from "@react-hook/window-size";

type Config = {
    top: number,
    left: number,
    right: number,
    bottom: number,
    horizontalRatio: number,
    verticalRation: number,
}

const portraitConfig: Config = {
    top: 3,
    left: -3,
    right: 1,
    bottom: -1,
    horizontalRatio: 7,
    verticalRation: 4,
}

const landscapeConfig: Config = {
    top: 1,
    left: -1,
    right: 2,
    bottom: -2,
    horizontalRatio: 10,
    verticalRation: 8,
}

const Camera: React.FC<{
    followTarget: null | Object3D,
}> = ({followTarget}) => {

    const groupRef = useRef<Group>(null as unknown as Group)
    const lightRef = useRef<DirectionalLight>(null as unknown as DirectionalLight)
    const cameraRef = useRef<PerspectiveCamera>(null as unknown as PerspectiveCamera)
    const {setDefaultCamera} = useThree()

    useLayoutEffect(() => {
        cameraRef.current.up.set(0,0,1);
        cameraRef.current.lookAt(0, 0, 1)
        void setDefaultCamera(cameraRef.current)
    }, [])

    useFollow(followTarget, groupRef, lightRef)

    // const {top, left, right, bottom} = useTweaks({
    //     top: 1,
    //     left: -1,
    //     right: 1,
    //     bottom: -1,
    // })
    //
    // const {horizontalRatio, verticalRation} = useTweaks({
    //     horizontalRatio: 10,
    //     verticalRation: 8,
    // })
    //
    // // 1, -1, 1, -1
    // // 10, 8

    const [width, height] = useWindowSize()


    const ratio = width / height

    const config = width > height ? landscapeConfig : portraitConfig
    const {
        top,
        left,
        right,
        bottom,
        horizontalRatio,
        verticalRation,
    } = config

    return (
        <group ref={groupRef}>
            <perspectiveCamera ref={cameraRef} position={[15, 15, 30]} fov={25}>
                <directionalLight ref={lightRef}
                                  position={[100, -100, 100]}
                                  intensity={0.4}
                                  castShadow
                                  shadowCameraTop={top * verticalRation * ratio}
                                  shadowCameraLeft={left * horizontalRatio * ratio}
                                  shadowCameraBottom={bottom * verticalRation}
                                  shadowCameraRight={right * horizontalRatio}
                                  shadowCameraNear={150}
                                  shadowCameraFar={250}
                                  shadow-mapSize-width={2048}
                                  shadow-mapSize-height={2048} />
                {/*{*/}
                {/*    lightRef.current && <ShadowHelper light={lightRef.current}/>*/}
                {/*}*/}
            </perspectiveCamera>
        </group>
    )
}

export default Camera