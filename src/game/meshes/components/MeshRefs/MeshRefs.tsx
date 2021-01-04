import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react"
import {Object3D} from "three";

type MeshRefsContextState = {
    meshes: {
        [key: string]: Object3D,
    },
    addMesh: (uuid: string, mesh: Object3D) => () => void,
}

const MeshRefsContext = createContext(null as unknown as MeshRefsContextState)

export const useStoreMesh = (uuid: string, mesh: Object3D) => {
    const addMesh = useContext(MeshRefsContext).addMesh

    useEffect(() => {

        const remove = addMesh(uuid, mesh)

        return () => {
            remove()
        }

    }, [addMesh, uuid, mesh])

}

export const useStoredMesh = (uuid: string): Object3D | null => {
    const meshes = useContext(MeshRefsContext).meshes

    const mesh = useMemo(() => {
        return meshes[uuid] ?? null
    }, [uuid, meshes])

    return mesh
}

const MeshRefs: React.FC = ({children}) => {

    const [meshes, setMeshes] = useState<{
        [key: string]: Object3D,
    }>({})

    const addMesh = useCallback((uuid: string, mesh: Object3D) => {

        setMeshes(state => {
            return {
                ...state,
                [uuid]: mesh,
            }
        })

        const removeMesh = () => {
            setMeshes(state => {
                const updated = {
                    ...state,
                }
                delete updated[uuid]
                return updated
            })
        }

        return removeMesh

    }, [setMeshes])

    return (
        <MeshRefsContext.Provider value={{
            meshes,
            addMesh,
        }}>
            {children}
        </MeshRefsContext.Provider>
    )
}

export default MeshRefs