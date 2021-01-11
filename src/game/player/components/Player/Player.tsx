import React, {Suspense, useRef, useState} from "react"
import {degToRad} from "../../../../utils/angles";
import {useController} from "./hooks/useController";
import {getPlayerUuid} from "../../../../infrastructure/meshes/uuids";
import {Object3D} from "three";
import {useSetCameraFollowTarget} from "../../../elements/camera/components/CameraProvider/CameraProvider";
import {useBodyApi, useStoreMesh, useSubscribeMesh} from "react-three-game-engine";
import Ninja from "../../../../3d/components/Ninja/Ninja";
import {useLocalState} from "./hooks/useLocalState";
import {useProxy} from "valtio";

const Player: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    useSubscribeMesh(uuid, ref.current, false)
    const localState = useLocalState()
    const localStateProxy = useProxy(localState)

    useStoreMesh(uuid, ref.current)
    const api = useBodyApi(uuid)
    useController(uuid, ref, api, localState)
    useSetCameraFollowTarget(ref.current)

    return (
        <group ref={ref}>
            <group rotation={[degToRad(90), 0, 0]}>
                <Suspense fallback={null}>
                    <Ninja moving={localStateProxy.moving} scale={[0.65, 0.65, 0.65]}/>
                </Suspense>
            </group>
        </group>
    )
}

export default Player