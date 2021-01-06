import {calculateAngleBetweenVectors} from "./angles";

export const angleToVector = (angle: number): [number, number] => {
    const xVector = Math.sin(angle)
    const yVector = Math.cos(angle)

    return [xVector, yVector]
}

export const getVectorMagnitude = (x: number, y: number): number => {
    return Math.sqrt(x * x + y * y)
}

export const calculateVectorsDistance = (x1: number, x2: number, y1: number, y2: number): number => {
    return getVectorMagnitude(Math.abs(x1 - x2), Math.abs(y1 - y2))
}

export const calculateVectorBetweenVectors = (x1: number, x2: number, y1: number, y2: number): [number, number] => {
    const angle = calculateAngleBetweenVectors(x1, x2, y1, y2)
    return angleToVector(angle)
}