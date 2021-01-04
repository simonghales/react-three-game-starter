import React, {useRef} from "react"
import Character from "../../../../../3d/components/Character/Character"
import {degToRad} from "../../../../../utils/angles";
import {useController} from "./hooks/useController";
import {getPlayerUuid} from "../../../../meshes/uuids";
import {Object3D} from "three";
import {useStoreMesh} from "../../../../meshes/components/MeshRefs/MeshRefs";
import {useBodyApi, useBodySync} from "../../../../../physics/hooks/hooks";

const Player: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    useBodySync(ref, uuid, true, false)
    useStoreMesh(uuid, ref.current)
    const api = useBodyApi(uuid)
    useController(uuid, api)

    return (
        <group ref={ref}>
            <group rotation={[degToRad(90), 0, 0]}>
                <Character/>
            </group>
        </group>
    )
}

export default Player