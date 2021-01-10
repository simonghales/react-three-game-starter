import React, {useRef} from "react"
import {getPlayerUuid} from "../../../../infrastructure/meshes/uuids";
import {Object3D} from "three";
import {Vec2} from "planck-js";
import {
    BodyType,
    createCircleFixture,
    useBody,
    useStoreMesh,
    useSyncWithMainComponent
} from "react-three-game-engine";
import {SyncComponentType} from "../../../../misc/types";

const LgPlayer: React.FC = () => {

    const uuid = getPlayerUuid()
    const ref = useRef<Object3D>(new Object3D())
    useStoreMesh(uuid, ref.current)

    useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(0, 0),
        linearDamping: 15,
        fixtures: [
            createCircleFixture({radius: 0.55, fixtureOptions: {
                density: 20,
            }})
        ],
    }), {
        uuid,
        fwdRef: ref,
    })

    useSyncWithMainComponent(SyncComponentType.PLAYER, "player")

    return null
}

export default LgPlayer