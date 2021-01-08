import React, {useRef} from "react"
import {SyncComponentType} from "../../../../workers/shared/types";
import {getPlayerUuid} from "../../../../infrastructure/meshes/uuids";
import {Object3D} from "three";
import {useStoreMesh} from "../../../../infrastructure/meshes/components/MeshRefs/MeshRefs";
import {BodyShape, BodyType} from "../../../../physics/bodies";
import {Vec2} from "planck-js";
import {useBody, useSyncWithMainComponent} from "r3";

const LgPlayer: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    useStoreMesh(uuid, ref.current)

    useBody(() => ({
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

    useSyncWithMainComponent(SyncComponentType.PLAYER, "player")

    return null
}

export default LgPlayer