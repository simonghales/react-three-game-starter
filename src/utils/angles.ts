import {MathUtils} from "three";
import {lerp} from "./numbers";

export const degToRad = MathUtils.degToRad;

export const vectorToAngle = (x: number, y: number): number => {
    return Math.atan2(x, y)
}

export const calculateAngleBetweenVectors = (x1: number, x2: number, y1: number, y2: number): number => {
    return Math.atan2((x1 - x2), (y1 - y2))
}

export const PI = 3.14159265359
export const PI_TIMES_TWO = 6.28318530718

export const lerpRadians = (angleA: number, angleB: number, lerpFactor: number): number => // Lerps from angle a to b (both between 0.f and PI_TIMES_TWO), taking the shortest path
{

    if (angleA > PI) {
        angleA -= PI_TIMES_TWO
    }

    if (angleB > PI) {
        angleB -= PI_TIMES_TWO
    }

    let result: number;
    let diff: number = angleB - angleA;
    if (diff < -PI)
    {
        // lerp upwards past PI_TIMES_TWO
        angleB += PI_TIMES_TWO;
        result = lerp(angleA, angleB, lerpFactor);
        if (result >= PI_TIMES_TWO)
        {
            result -= PI_TIMES_TWO;
        }
    }
    else if (diff > PI)
    {
        // lerp downwards past 0
        angleB -= PI_TIMES_TWO;
        result = lerp(angleA, angleB, lerpFactor);
        if (result < 0)
        {
            result += PI_TIMES_TWO;
        }
    }
    else
    {
        // straight lerp
        result = lerp(angleA, angleB, lerpFactor);
    }

    return result;
}
