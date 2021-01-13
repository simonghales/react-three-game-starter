import React, {Suspense, useEffect, useLayoutEffect, useState} from "react";
import {Engine} from "react-three-game-engine";
import Player from "../../../../../player/components/Player/Player";
import CameraProvider from "../../../../../elements/camera/components/CameraProvider/CameraProvider";
import {SyncComponentType} from "../../../../../../misc/types";
import InstancingProvider, {InstancedMesh} from "../../../../../../temp/instancing/InstancingProvider";

const mappedComponentTypes = {
    [SyncComponentType.PLAYER]: Player,
}

const GameEngine: React.FC = ({children}) => {

    const [logicWorker, setLogicWorker] = useState<null | Worker>(null)

    useLayoutEffect(() => {
        setLogicWorker(new Worker('../../../../../../workers/logic/index.ts', { type: 'module' }))
    }, [setLogicWorker])

    if (!logicWorker) return null

    return (
        <CameraProvider>
            <Engine logicWorker={logicWorker} logicMappedComponents={mappedComponentTypes}>
                <InstancingProvider>
                    <Suspense fallback={null}>
                        <InstancedMesh maxInstances={10} meshKey="bamboo" gltfPath="/models/Bamboo_4.glb"/>
                    </Suspense>
                    {children}
                </InstancingProvider>
            </Engine>
        </CameraProvider>
    );
};

export default GameEngine;