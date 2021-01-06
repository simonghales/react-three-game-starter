import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import styled from "styled-components";
import {useWindowSize} from "@react-hook/window-size";
import {lerp} from "../../../../utils/numbers";
import {proxy, useProxy} from "valtio";
import {calculateVectorsDistance} from "../../../../utils/vectors";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const StyledJoyContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

const StyledJoy = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
`

const getClientXY = (event: any): [number, number] | null => {
    switch (event.type) {
        case "mouseup":
        case "mousedown":
        case "mousemove":
            return [event.clientX, event.clientY]
        case "touchstart":
        case "touchend":
            return [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
        case "touchmove":
            return [event.targetTouches[0].clientX, event.targetTouches[0].clientY]
    }
    return null
}

enum StartingPoint {
    MOUSE = 'MOUSE',
    TOUCH = 'TOUCH',
}

const TouchHandler: React.FC = ({children}) => {

    const joyStickRef = useRef<HTMLDivElement | null>(null)

    const localStateRef = useRef<{
        mouseStarted: number,
        mouseActive: boolean,
        mouseStartX: number,
        mouseStartY: number,
        touchStarts: {
            [id: string]: {
                started: number,
                x: number,
                y: number,
            }
        },
    }>({
        mouseStarted: 0,
        mouseActive: false,
        mouseStartX: 0,
        mouseStartY: 0,
        touchStarts: {},
    })

    const localState = localStateRef.current

    const [startingPoint, setStartingPoint] = useState<{
        type: StartingPoint,
        id?: number,
        x: number,
        y: number,
    } | null>(null)

    const handleMove = useCallback((x: number, y: number, type: StartingPoint, id?: number) => {

        let startingX = x
        let startingY = y

        if (type === StartingPoint.MOUSE) {
            startingX = localState.mouseStartX
            startingY = localState.mouseStartY
        } else {
            if (id && localState.touchStarts[id]) {
                startingX = localState.touchStarts[id].x
                startingY = localState.touchStarts[id].y
            }
        }

        const handleUpdate = (distance: number) => {

            console.log('distance', distance)

        }

        if (!startingPoint) {

            const distance = calculateVectorsDistance(startingX, x, startingY, y)
            const threshold = 3

            if (distance > threshold) {
                setStartingPoint({
                    type,
                    id,
                    x: startingX,
                    y: startingY,
                })
                handleUpdate(distance)
            }


        } else if (startingPoint.type === type && startingPoint.id === id) {

            const distance = calculateVectorsDistance(startingX, x, startingY, y)

            handleUpdate(distance)

        }

    }, [startingPoint, setStartingPoint, localState])

    const addStartingPoint = useCallback((x: number, y: number, type: StartingPoint, id?: number) => {

        // if (startingPoint) return
        //
        // setStartingPoint({
        //     type,
        //     id,
        //     x,
        //     y,
        // })

    }, [startingPoint, setStartingPoint])

    const removeStartingPoint = useCallback((type: StartingPoint, id?: number) => {

        if (startingPoint && startingPoint.type === type && startingPoint.id === id) {
            setStartingPoint(null)
        }

    }, [startingPoint, setStartingPoint])

    const onStart = useCallback((event: any) => {

        if (event.type === "mousedown") {
            const x = event.clientX
            const y = event.clientY
            localState.mouseStartX = x
            localState.mouseStartY = y
            localState.mouseStarted = Date.now()
            localState.mouseActive = true
            addStartingPoint(x, y, StartingPoint.MOUSE)
        } else if (event.type === "touchstart") {
            if (event.changedTouches.length > 0) {
                const touch = event.changedTouches[0] as {identifier: number, clientX: number, clientY: number}
                const {identifier, clientX, clientY} = touch
                localState.touchStarts[identifier] = {
                    started: Date.now(),
                    x: clientX,
                    y: clientY,
                }
                addStartingPoint(clientX, clientY, StartingPoint.TOUCH, identifier)
            }
        }
    }, [localState, addStartingPoint])

    const onEnd = useCallback((event: any) => {

        if (event.type === "mouseup") {
            localState.mouseActive = false
            removeStartingPoint(StartingPoint.MOUSE)
        } else if (event.type === "touchend") {
            Object.values(event.changedTouches).forEach((touch) => {
                const {identifier} = touch as {identifier: number}
                delete localState.touchStarts[identifier]
                removeStartingPoint(StartingPoint.TOUCH, identifier)
            })
        }

    }, [localState, removeStartingPoint])

    const onMove = useCallback((event: any) => {

        if (event.type === 'mousemove' && localState.mouseActive) {
            handleMove(event.clientX, event.clientY, StartingPoint.MOUSE)
        } else if (event.type === 'touchmove') {
            Object.values(event.changedTouches).forEach((touch) => {
                const {identifier, clientX, clientY} = touch as {identifier: number, clientX: number, clientY: number}
                handleMove(clientX, clientY, StartingPoint.TOUCH, identifier)
            })
        }
    }, [handleMove])

    useEffect(() => {

        const joystick = joyStickRef.current

        if (!joystick) return

        if (startingPoint) {
            joystick.style.transform = `translate(${startingPoint.x}px, ${startingPoint.y}px)`
            joystick.style.visibility = 'visible'
        } else {
            joystick.style.visibility = 'hidden'
        }

    }, [startingPoint, joyStickRef])

    return (
        <StyledContainer onTouchStartCapture={onStart}
                         onMouseDownCapture={onStart}
                         onTouchEndCapture={onEnd}
                         onMouseUpCapture={onEnd}
                         onTouchMoveCapture={onMove}
                         onMouseMoveCapture={onMove}>
            {children}
            <StyledJoyContainer ref={joyStickRef}>
                <StyledJoy/>
            </StyledJoyContainer>
        </StyledContainer>
    )
}

export default TouchHandler