import React, {useRef} from "react"
import {useSyncWithMainComponent} from "../../../../../temp/sync";
import {SyncComponentType} from "../../../../../workers/shared/types";
import {getPlayerUuid} from "../../../../meshes/uuids";
import {Object3D} from "three";
import {useStoreMesh} from "../../../../meshes/components/MeshRefs/MeshRefs";
import {useBodyRaw} from "../../../../../physics/hooks/hooks";
import {BodyShape, BodyType} from "../../../../../physics/bodies";
import {Vec2} from "planck-js";

const LgPlayer: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    useStoreMesh(uuid, ref.current)

    useBodyRaw(() => ({
        type: BodyType.dynamic,
        position: Vec2(0, 0),
        linearDamping: 4,
        fixtures: [{
            shape: BodyShape.circle,
            radius: 0.75,
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