import React, {createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {InstancedMesh as TInstancedMesh, Matrix4, Mesh, Object3D} from "three";
import {useGLTF} from "@react-three/drei/useGLTF";
import {useDidMount} from "../../utils/hooks";

type InstanceData = {
    position?: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number]
}

type UpdateInstanceFn = (data: InstanceData) => void

type AddInstanceFn = (data: InstanceData) => [UpdateInstanceFn, () => void]

type InstancedMeshes = {
    [key: string]: AddInstanceFn,
}


type ContextState = {
    instancedMeshes: InstancedMeshes,
    createInstancedMesh: (meshKey: string, addInstance: AddInstanceFn) => () => void,
}

const Context = createContext(null as unknown as ContextState)

export const useCreateInstancedMesh = () => {
    return useContext(Context).createInstancedMesh
}

export const useInstancedMesh = (meshKey: string, data: InstanceData) => {
    const updateRef = useRef<UpdateInstanceFn>()
    const instancedMeshes = useContext(Context).instancedMeshes
    const addInstance = instancedMeshes[meshKey] ?? null

    useEffect(() => {

        if (addInstance) {

            const [update, remove] = addInstance(data)
            updateRef.current = update
            return remove

        }

    }, [addInstance, updateRef])

    return useCallback((data: InstanceData) => {
        if (updateRef.current) {
            updateRef.current(data)
        }
    }, [updateRef])

}

export const SingleInstance: React.FC<{
    meshKey: string,
} & InstanceData> = ({meshKey, ...data}) => {

    const didMount = useDidMount()

    const update = useInstancedMesh(meshKey, data)

    const {position, rotation, scale} = data

    useEffect(() => {
        if (didMount()) {
            update({position, rotation, scale})
        }
    }, [position, rotation, scale, update])

    return null

}

const defaultObject = new Object3D()

export const InstancedMesh: React.FC<{
    meshKey: string,
    maxInstances: number,
    gltfPath: string,
}> = ({meshKey, maxInstances, gltfPath}) => {

    const createInstancedMesh = useCreateInstancedMesh()

    const {nodes} = useGLTF(gltfPath) as unknown as {nodes: {
        [key: string]: Object3D,
        }}

    const meshes = Object.values(nodes).filter(node => node.type === "Mesh") as Mesh[]

    const instancedMeshes = useRef<TInstancedMesh[]>([])

    const handleRef = useCallback((instancedMesh: TInstancedMesh) => {
        instancedMeshes.current.push(instancedMesh)
    }, [instancedMeshes])

    useLayoutEffect(() => {
        instancedMeshes.current.forEach(instancedMesh => {
            instancedMesh.count = 0
        })
    }, [instancedMeshes])

    const idRef = useRef(0)
    const instancesRef = useRef<string[]>([])

    const removeInstance = useCallback((id: string) => {

        const instanceIndex = instancesRef.current.findIndex(instanceId => instanceId === id)

        instancedMeshes.current.forEach(instancedMesh => {
            const count = instancedMesh.count

            for (let i = instanceIndex + 1; i < count; i++) {
                const previousIndex = i - 1
                if (previousIndex < 0) break
                const matrix = new Matrix4()
                instancedMeshes.current.forEach(instancedMesh => {
                    instancedMesh.getMatrixAt(i, matrix)
                    instancedMesh.setMatrixAt(previousIndex, matrix)
                })
            }

        })

        instancesRef.current.splice(instanceIndex, 1)

        instancedMeshes.current.forEach(instancedMesh => {
            instancedMesh.count = instancesRef.current.length
        })

    }, [instancedMeshes, instancesRef])

    const updateInstance = useCallback((id: string, {
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = [1, 1, 1]
    }: InstanceData) => {

        const instanceIndex = instancesRef.current.findIndex(instanceId => instanceId === id)

        defaultObject.position.set(...position)
        defaultObject.rotation.set(...rotation)
        defaultObject.scale.set(...scale)
        defaultObject.updateMatrix()

        instancedMeshes.current.forEach(instancedMesh => {
            instancedMesh.setMatrixAt(instanceIndex, defaultObject.matrix)
            instancedMesh.instanceMatrix.needsUpdate = true
        })

    }, [instancedMeshes, instancesRef])

    const addInstance = useCallback((data: InstanceData): [UpdateInstanceFn, () => void] => {

        idRef.current += 1
        const id = `${idRef.current}`

        instancesRef.current.push(id)
        updateInstance(id, data)

        instancedMeshes.current.forEach(instancedMesh => {
            instancedMesh.count = instancesRef.current.length
        })

        const update = (updateData: InstanceData) => {
            updateInstance(id, updateData)
        }

        const unsubscribe = () => {
            removeInstance(id)
        }

        return [update, unsubscribe]

    }, [instancedMeshes, idRef, updateInstance, removeInstance])

    useEffect(() => {
        const unsubscribe = createInstancedMesh(meshKey, addInstance)

        return unsubscribe
    }, [createInstancedMesh, addInstance])

    return (
        <>
            {meshes.map((mesh) => (
                <instancedMesh ref={handleRef} matrixAutoUpdate={false} args={[mesh.geometry, mesh.material, maxInstances] as any}
                               key={mesh.uuid} castShadow receiveShadow/>
            ))}
        </>
    )
}

const InstancingProvider: React.FC = ({children}) => {

    const [instancedMeshes, setInstancedMeshes] = useState<InstancedMeshes>({})

    const createInstancedMesh = useCallback((meshKey: string, addInstance: AddInstanceFn) => {

        setInstancedMeshes(state => {
            return {
                ...state,
                [meshKey]: addInstance,
            }
        })

        const unsubscribe = () => {
            setInstancedMeshes(state => {
                const updatedState = {
                    ...state,
                }
                delete updatedState[meshKey]
                return updatedState
            })
        }

        return unsubscribe

    }, [setInstancedMeshes])

    return (
        <Context.Provider value={{
            instancedMeshes,
            createInstancedMesh,
        }}>
            {children}
        </Context.Provider>
    );
};

export default InstancingProvider;