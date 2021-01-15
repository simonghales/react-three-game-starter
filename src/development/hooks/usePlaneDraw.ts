import {useCallback, useRef, useState} from "react";

export const usePlaneDraw = ({
                                 onStart,
                                 onEnd,
                                 onMove,
                             }: {
    onStart: (position: [number, number]) => void,
    onEnd: (position: [number, number], startPosition: [number, number]) => void,
    onMove: (position: [number, number], startPosition: [number, number]) => void
}): Pick<JSX.IntrinsicElements['group'], "onPointerDown" | "onPointerUp" | "onPointerMove"> => {

    const localStateRef = useRef<{
        active: boolean,
        startPos: [number, number],
        currentPos: [number, number],
    }>({
        active: false,
        startPos: [0, 0],
        currentPos: [0, 0]
    })

    const onPointerDown = useCallback((event: any) => {
        const {point} = event
        localStateRef.current.startPos = [point.x, point.y]
        localStateRef.current.currentPos = localStateRef.current.startPos
        localStateRef.current.active = true
        onStart(localStateRef.current.startPos)
    }, [onStart])

    const onPointerUp = useCallback((event: any) => {
        const {point} = event
        localStateRef.current.active = false
        onEnd([point.x, point.y], localStateRef.current.startPos)
    }, [onEnd])

    const onPointerMove = useCallback((event: any) => {
        if (localStateRef.current.active) {
            const {point} = event
            localStateRef.current.currentPos = [point.x, point.y]
            onMove(localStateRef.current.currentPos, localStateRef.current.startPos)
        }
    }, [onMove])

    return {
        onPointerDown,
        onPointerUp,
        onPointerMove,
    }

}