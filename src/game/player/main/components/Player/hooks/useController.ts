import {useCallback} from "react";
import {useFrame} from "react-three-fiber";
import {inputsRawState} from "../../../../../main/inputs/state";
import {BodyApi} from "../../../../../../physics/hooks/hooks";
import {Vec2} from "planck-js";
import { useFixedUpdate } from "../../../../../worker/components/PhysicsWorkerFixedUpdateProvider/PhysicsWorkerFixedUpdateProvider";
import {joystickState} from "../../../../../main/components/TouchHandler/TouchHandler";

const velocity = Vec2(0, 0)

export const useController = (uuid: string, api: BodyApi) => {

    const onFrame = useCallback(() => {

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
        // api.applyLinearImpulse(velocity, Vec2(0, 0))

    }, [api])

    const onFixedUpdate = useCallback(() => {

    }, [api])

    useFrame(onFrame)
    useFixedUpdate(onFixedUpdate)

}