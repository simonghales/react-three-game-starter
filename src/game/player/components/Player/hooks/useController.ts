import {MutableRefObject, useCallback, useRef} from "react";
import {useFrame} from "react-three-fiber";
import {Vec2} from "planck-js";
import { BodyApi, useFixedUpdate } from "react-three-game-engine";
import {inputsRawState} from "../../../../main/inputs/state";
import {joystickState} from "../../../../main/components/TouchHandler/TouchHandler";
import {LocalState} from "./useLocalState";
import {degToRad, lerpRadians, vectorToAngle} from "../../../../../utils/angles";
import {Object3D} from "three";

const velocity = Vec2(0, 0)
const v2 = Vec2(0, 0)

export const useController = (uuid: string, ref: MutableRefObject<Object3D>, api: BodyApi, localState: LocalState) => {

    const localRef = useRef({
        angle: 0,
    })

    const getMoveVelocity = useCallback((): [number, number] => {
        let xVel = 0
        let yVel = 0

        if (joystickState.active) {
            xVel = joystickState.xVel
            yVel = joystickState.yVel
        } else {
            xVel = inputsRawState.horizontal
            yVel = inputsRawState.vertical
        }

        return [xVel, yVel]
    }, [])

    const onFrame = useCallback((state: any, delta: number) => {

        const [xVel, yVel] = getMoveVelocity()

        const moving = xVel !== 0 || yVel !== 0

        let newAngle = localRef.current.angle

        if (moving) {
            const angle = vectorToAngle(xVel, yVel * -1)
            localRef.current.angle = angle
            newAngle = angle
        }

        ref.current.rotation.z = lerpRadians(ref.current.rotation.z, newAngle, delta * 10)

        localState.moving = moving

    }, [api, ref, localRef, getMoveVelocity, localState])

    const onFixedUpdate = useCallback((delta: number) => {

        const [xVel, yVel] = getMoveVelocity()

        velocity.set(xVel * 1000 * delta, yVel * 1000 * delta)

        api.applyLinearImpulse(velocity, v2)

    }, [api, getMoveVelocity])

    useFrame(onFrame)
    useFixedUpdate(onFixedUpdate)

}