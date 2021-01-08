import {useCallback} from "react";
import {useFrame} from "react-three-fiber";
import {Vec2} from "planck-js";
import { BodyApi, useFixedUpdate } from "r3";
import {inputsRawState} from "../../../../main/inputs/state";
import {joystickState} from "../../../../main/components/TouchHandler/TouchHandler";

const velocity = Vec2(0, 0)

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

        velocity.set(xVel * 5, yVel * 5)
        api.setLinearVelocity(velocity)

    }, [api])

    useFrame(onFrame)
    useFixedUpdate(onFixedUpdate)

}