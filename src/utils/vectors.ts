export const angleToVector = (angle: number): [number, number] => {
    const xVector = Math.sin(angle)
    const yVector = Math.cos(angle)

    return [xVector, yVector]
}