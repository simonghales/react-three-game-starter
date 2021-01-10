import {DirectionalLight, Group, Object3D} from "three";
import {MutableRefObject, useCallback} from "react";
import {useFrame} from "react-three-fiber";

export const useFollow = (followTarget: null | Object3D, ref: MutableRefObject<Group>, lightRef: MutableRefObject<DirectionalLight>) => {

    const onFrame = useCallback((state: any, delta: number) => {

        if (!followTarget) return

        const camera = ref.current

        const targetX = followTarget.position.x
        const targetY = followTarget.position.y

        camera.position.x = targetX
        camera.position.y = targetY

        const light = lightRef.current
        light.target.position.x = camera.position.x
        light.target.position.y = camera.position.y
        light.target.position.z = camera.position.z
        light.target.updateMatrixWorld()

    }, [followTarget, ref, lightRef])

    useFrame(onFrame)

}