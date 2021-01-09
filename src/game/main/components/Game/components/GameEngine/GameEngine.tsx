import React, {useEffect, useLayoutEffect, useState} from "react";
import {Engine} from "react-three-game-engine";
import Player from "../../../../../player/components/Player/Player";
import CameraProvider from "../../../../../elements/camera/components/CameraProvider/CameraProvider";
import {SyncComponentType} from "../../../../../../misc/types";

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
                {children}
            </Engine>
        </CameraProvider>
    );
};

export default GameEngine;