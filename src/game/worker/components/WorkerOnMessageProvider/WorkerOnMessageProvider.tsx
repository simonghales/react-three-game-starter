import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react"

type WorkerOnMessageContextState = {
    subscribe: (callback: (event: MessageEvent) => void) => () => void,
}

const WorkerOnMessageContext = createContext(null as unknown as WorkerOnMessageContextState)

export const useWorkerOnMessage = () => {
    return useContext(WorkerOnMessageContext).subscribe
}

const WorkerOnMessageProvider: React.FC<{
    worker: Worker | MessagePort
}> = ({children, worker}) => {

    const idCount = useRef(0)
    const subscriptionsRef = useRef<{
        [key: string]: (event: MessageEvent) => void,
    }>({})

    const subscribe = useCallback((callback: (event: MessageEvent) => void) => {

        const id = idCount.current
        idCount.current += 1

        subscriptionsRef.current[id] = callback

        return () => {
            delete subscriptionsRef.current[id]
        }

    }, [subscriptionsRef])

    useEffect(() => {

        worker.onmessage = (event: MessageEvent) => {

            Object.values(subscriptionsRef.current).forEach((callback) => {
                callback(event)
            })

        }

    }, [worker, subscriptionsRef])

    return (
        <WorkerOnMessageContext.Provider value={{
            subscribe,
        }}>
            {children}
        </WorkerOnMessageContext.Provider>
    )
}

export default WorkerOnMessageProvider