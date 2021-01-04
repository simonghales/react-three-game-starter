import {MathUtils} from "three";

export const degToRad = MathUtils.degToRad;

export const vectorToAngle = (x: number, y: number): number => {
    return Math.atan2(x, y)
}
