import {useCallback} from "react";
import {useFrame} from "react-three-fiber";
import {Vec2} from "planck-js";
import { BodyApi, useFixedUpdate } from "react-three-game-engine";
import {inputsRawState} from "../../../../main/inputs/state";
import {joystickState} from "../../../../main/components/TouchHandler/TouchHandler";

const velocity = Vec2(0, 0)
const v2 = Vec2(0, 0)

export const useController = (uuid: string, api: BodyApi) => {

    const onFrame = useCallback(() => {

    }, [api])

    const onFixedUpdate = useCallback((delta: number) => {

        let xVel = 0
        let yVel = 0

        if (joystickState.active) {
            xVel = joystickState.xVel
            yVel = joystickState.yVel
        } else {
            xVel = inputsRawState.horizontal
            yVel = inputsRawState.vertical
        }

        velocity.set(xVel * 1000 * delta, yVel * 1000 * delta)

        api.applyLinearImpulse(velocity, v2)

    }, [api])

    useFrame(onFrame)
    useFixedUpdate(onFixedUpdate)

}