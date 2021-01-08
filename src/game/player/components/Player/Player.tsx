import React, {useRef} from "react"
import Character from "../../../../3d/components/Character/Character"
import {degToRad} from "../../../../utils/angles";
import {useController} from "./hooks/useController";
import {getPlayerUuid} from "../../../../infrastructure/meshes/uuids";
import {Object3D} from "three";
import {useStoreMesh} from "../../../../infrastructure/meshes/components/MeshRefs/MeshRefs";
import {useBodyApi, useBodySync} from "../../../../physics/hooks/hooks";
import {useAddMeshSubscription} from "../../../../infrastructure/worker/components/MeshSubscriptions/MeshSubscriptions";
import {useSetCameraFollowTarget} from "../../../elements/camera/components/CameraProvider/CameraProvider";
import {useBody} from "r3";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";

const Player: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    // useAddMeshSubscription(uuid, ref.current, false)

    const [,api] = useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(0, 0),
        linearDamping: 4,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.55,
            fixtureOptions: {
                density: 20,
            }
        }],
    }), {
        uuid,
        fwdRef: ref,
    })


    useStoreMesh(uuid, ref.current)
    // const api = useBodyApi(uuid)
    useController(uuid, api)
    useSetCameraFollowTarget(ref.current)

    return (
        <group ref={ref}>
            <group rotation={[degToRad(90), 0, 0]}>
                <Character/>
            </group>
        </group>
    )
}

export default Player