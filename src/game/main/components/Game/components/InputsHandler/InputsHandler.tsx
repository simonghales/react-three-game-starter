import React, {useCallback, useEffect} from "react"
import {useFrame} from "react-three-fiber";
import {inputs, isKeyActive} from "../../../../inputs/config";
import {Vec2} from "planck-js";
import {degToRad, vectorToAngle} from "../../../../../../utils/angles";
import {inputsRawState} from "../../../../inputs/state";
import {angleToVector} from "../../../../../../utils/vectors";
import hotkeys from "hotkeys-js";

const vector = Vec2(0, 0)

const calculateRawInput = () => {

    const up = isKeyActive(inputs.up)
    const down = isKeyActive(inputs.down)
    const right = isKeyActive(inputs.right)
    const left = isKeyActive(inputs.left)

    const vertical = up ? 1 : down ? -1 : 0
    const horizontal = right ? 1 : left ? -1 : 0

    if (vertical !== 0 || horizontal !== 0) {

        vector.set(horizontal, vertical)

        const originalAngle = vectorToAngle(horizontal, vertical)

        const rotatedAngle = originalAngle + degToRad(45)

        const [xVel, yVel] = angleToVector(rotatedAngle)

        inputsRawState.active = true
        inputsRawState.horizontal = xVel * -1
        inputsRawState.vertical = yVel * -1

    } else {

        inputsRawState.active = false
        inputsRawState.horizontal = 0
        inputsRawState.vertical = 0

    }

}

const InputsHandler: React.FC = ({children}) => {

    const onFrame = useCallback(() => {

        calculateRawInput()

    }, [])

    useEffect(() => {

        hotkeys('*', '', () => {})

    }, [])

    useFrame(onFrame)

    return (
        <>
            {children}
        </>
    )
}

export default InputsHandler