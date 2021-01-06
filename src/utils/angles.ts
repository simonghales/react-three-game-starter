import {MathUtils} from "three";

export const degToRad = MathUtils.degToRad;

export const vectorToAngle = (x: number, y: number): number => {
    return Math.atan2(x, y)
}

export const calculateAngleBetweenVectors = (x1: number, x2: number, y1: number, y2: number): number => {
    return Math.atan2((x1 - x2), (y1 - y2))
}

