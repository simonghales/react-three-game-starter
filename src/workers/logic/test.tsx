import * as React from "react";
import {FC, useEffect, useState} from "react";
import {snapshot, useProxy} from "valtio";

const Test: FC<{
    worker: Worker,
    state: {
        physicsWorker: null | Worker | MessagePort,
        initiated: boolean,
    }
}> = ({children, worker, state}) => {

    const proxyState = useProxy(state)
    const initiated = proxyState.initiated
    const physicsWorker = proxyState.physicsWorker
    const [fin, setFin] = useState<null | Worker | MessagePort>(null)

    useEffect(() => {
        console.log('initiated', initiated)
    }, [initiated])

    useEffect(() => {
        if (state.physicsWorker) {
            setFin(snapshot(state.physicsWorker))
        }
        console.log('physicsWorker', physicsWorker)
    }, [physicsWorker])

    console.log('fin', fin)

    return (
        <>
            {children}
        </>
    );
};

export {
    Test,
}