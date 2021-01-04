import React, {createContext, useContext, useEffect, useState} from "react"
import {useProxy} from "valtio";
import {logicAppState, workerStorage} from "../../state";
import WorkerOnMessageProvider
    from "../../../../../game/worker/components/WorkerOnMessageProvider/WorkerOnMessageProvider";

type LgPhysicsWorkerContextState = {
    worker: Worker | MessagePort,
}

const LgPhysicsWorkerContext = createContext(null as unknown as LgPhysicsWorkerContextState)

export const useLgPhysicsWorker = () => {
    return useContext(LgPhysicsWorkerContext).worker
}

const LgPhysicsWorker: React.FC = ({children}) => {

    const stateProxy = useProxy(logicAppState)
    const [worker, setWorker] = useState<MessagePort | null>(null)
    const workerLoaded = stateProxy.workerLoaded

    useEffect(() => {

        if (workerLoaded && workerStorage.worker) {
            setWorker(workerStorage.worker)
        }

    }, [workerLoaded])

    if (!worker) return null

    return (
        <LgPhysicsWorkerContext.Provider value={{worker}}>
            <WorkerOnMessageProvider worker={worker}>
                {children}
            </WorkerOnMessageProvider>
        </LgPhysicsWorkerContext.Provider>
    )
}

export default LgPhysicsWorker