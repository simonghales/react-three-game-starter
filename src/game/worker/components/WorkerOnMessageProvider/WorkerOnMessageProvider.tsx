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
    const [subscriptions, setSubscriptions] = useState<{
        [key: string]: (event: MessageEvent) => void,
    }>({})

    const subscribe = useCallback((callback: (event: MessageEvent) => void) => {

        const id = idCount.current
        idCount.current += 1

        setSubscriptions(state => ({
            ...state,
            [id]: callback,
        }))

        return () => {
            setSubscriptions(state => {
                const updatedState = {
                    ...state,
                }
                delete updatedState[id]
                return updatedState
            })
        }

    }, [])

    useEffect(() => {

        // is there risk of missing a message when subscriptions changes?

        worker.onmessage = (event: MessageEvent) => {

            Object.values(subscriptions).forEach((callback) => {
                callback(event)
            })

        }

    }, [worker, subscriptions])

    return (
        <WorkerOnMessageContext.Provider value={{
            subscribe,
        }}>
            {children}
        </WorkerOnMessageContext.Provider>
    )
}

export default WorkerOnMessageProvider