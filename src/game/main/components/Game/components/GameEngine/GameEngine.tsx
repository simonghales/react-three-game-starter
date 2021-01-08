import React, {useEffect, useState} from "react";
import {Physics} from "react-three-game-engine";
import Player from "../../../../../player/components/Player/Player";
import CameraProvider from "../../../../../elements/camera/components/CameraProvider/CameraProvider";
import {SyncComponentType} from "../../../../../../misc/types";

const mappedComponentTypes = {
    [SyncComponentType.PLAYER]: Player,
}

const GameEngine: React.FC = ({children}) => {

    const [logicWorker] = useState(() => new Worker('../../../../../../workers/logic', { type: 'module' }))

    return (
        <CameraProvider>
            <Physics logicWorker={logicWorker} logicMappedComponents={mappedComponentTypes}>
                {children}
            </Physics>
        </CameraProvider>
    );
};

export default GameEngine;