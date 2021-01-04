import {useCallback} from "react";
import {useFrame} from "react-three-fiber";
import {inputsRawState} from "../../../../../main/inputs/state";
import {BodyApi} from "../../../../../../physics/hooks/hooks";
import {Vec2} from "planck-js";

const velocity = Vec2(0, 0)

export const useController = (uuid: string, api: BodyApi) => {

    const onFrame = useCallback(() => {

        const xVel = inputsRawState.horizontal
        const yVel = inputsRawState.vertical

        velocity.set(xVel * 10, yVel * 10)
        // api.setLinearVelocity(velocity)
        api.applyLinearImpulse(velocity, Vec2(0, 0))

    }, [api])

    useFrame(onFrame)

}