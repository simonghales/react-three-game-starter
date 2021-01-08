import React, {useEffect, useState} from "react";
import {Physics} from "r3";
import {SyncComponentType} from "../../../../../../workers/shared/types";
import Player from "../../../../../player/components/Player/Player";
import MeshRefs from "../../../../../../infrastructure/meshes/components/MeshRefs/MeshRefs";
import CameraProvider from "../../../../../elements/camera/components/CameraProvider/CameraProvider";

const mappedComponentTypes = {
    [SyncComponentType.PLAYER]: Player,
}

const GameEngine: React.FC = ({children}) => {

    const [logicWorker] = useState(() => new Worker('../../../../../../workers/logic', { type: 'module' }))

    return (
        <CameraProvider>
            <MeshRefs>
                <Physics logicWorker={logicWorker} logicMappedComponents={mappedComponentTypes}>
                    {children}
                </Physics>
            </MeshRefs>
        </CameraProvider>
    );
};

export default GameEngine;