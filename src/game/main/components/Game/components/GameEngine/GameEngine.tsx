import React, {useState} from "react";
import {Physics} from "r3";

const GameEngine: React.FC = ({children}) => {

    const [logicWorker] = useState(() => new Worker('../../../../../../workers/logic', { type: 'module' }))

    return (
        <Physics logicWorker={logicWorker}>
            {children}
        </Physics>
    );
};

export default GameEngine;