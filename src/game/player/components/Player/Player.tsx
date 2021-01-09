import React, {useEffect, useRef} from "react"
import Character from "../../../../3d/components/Character/Character"
import {degToRad} from "../../../../utils/angles";
import {useController} from "./hooks/useController";
import {getPlayerUuid} from "../../../../infrastructure/meshes/uuids";
import {Object3D} from "three";
import {useSetCameraFollowTarget} from "../../../elements/camera/components/CameraProvider/CameraProvider";
import {useBodyApi, useOnMessage, useSendMessage, useStoreMesh, useSubscribeMesh} from "react-three-game-engine";

const Player: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    useSubscribeMesh(uuid, ref.current, false)

    useStoreMesh(uuid, ref.current)
    const api = useBodyApi(uuid)
    useController(uuid, api)
    useSetCameraFollowTarget(ref.current)

    const sendMessage = useSendMessage()
    const subscribe = useOnMessage()

    useEffect(() => {
        sendMessage('', 'hello world')
    }, [sendMessage, subscribe])

    return (
        <group ref={ref}>
            <group rotation={[degToRad(90), 0, 0]}>
                <Character/>
            </group>
        </group>
    )
}

export default Player