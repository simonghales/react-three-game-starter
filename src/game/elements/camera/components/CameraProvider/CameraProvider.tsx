import React, {createContext, useCallback, useContext, useEffect, useState} from "react"
import Camera from "../Camera/Camera"
import {Object3D} from "three";

type State = {
    setCameraFollowTarget: (target: Object3D) => () => void,
}

const Context = createContext(null as unknown as State)

export const useSetCameraFollowTarget = (target: Object3D) => {
    const setCameraFollowTarget = useContext(Context).setCameraFollowTarget

    useEffect(() => {

        const unsubscribe = setCameraFollowTarget(target)

        return () => {
            unsubscribe()
        }

    }, [target, setCameraFollowTarget])

}

const CameraProvider: React.FC = ({children}) => {

    const [followTarget, setFollowTarget] = useState<null | Object3D>(null)

    const setCameraFollowTarget = useCallback((target: Object3D) => {

        setFollowTarget(target)

        const unsubscribe = () => {
            setFollowTarget(null)
        }

        return unsubscribe

    }, [setFollowTarget])

    return (
        <Context.Provider value={{
            setCameraFollowTarget,
        }}>
            <Camera followTarget={followTarget}/>
            {children}
        </Context.Provider>
    )
}

export default CameraProvider