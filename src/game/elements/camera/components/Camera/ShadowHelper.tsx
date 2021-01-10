import React, {useRef} from "react"
import {CameraHelper, DirectionalLight} from "three";
import {useHelper} from "@react-three/drei";

const ShadowHelper: React.FC<{
    light: DirectionalLight
}> = ({light}) => {

    const ref = useRef(light.shadow.camera)

    useHelper(ref, CameraHelper)

    return null
}

export default ShadowHelper