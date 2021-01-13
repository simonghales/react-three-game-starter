import {Instance, ManagedInstancedMesh} from "./ManagedInstancedMesh";
import {RefObject, useEffect, useRef} from "react";

type InstanceFactory = () => Pick<Instance, "object" | "color">

export const useInstance = (
    imesh: ManagedInstancedMesh | RefObject<ManagedInstancedMesh>,
    factory: InstanceFactory
) => {
    const instanceRef = useRef<Instance>()

    useEffect(() => {
        const [instances, cleanup] = makeInstances(1, imesh, factory)
        instanceRef.current = instances[0]
        return cleanup
    }, [])

    return instanceRef
}

export const useInstances = (
    count: number,
    imesh: ManagedInstancedMesh | RefObject<ManagedInstancedMesh>,
    factory: InstanceFactory
) => {
    const instancesRef = useRef<Instance[]>([])

    useEffect(() => {
        const [instances, cleanup] = makeInstances(count, imesh, factory)
        instancesRef.current = instances
        return cleanup
    }, [])

    return instancesRef
}

const makeInstances = (
    count: number,
    imesh: ManagedInstancedMesh | RefObject<ManagedInstancedMesh>,
    factory: InstanceFactory
): [Instance[], () => void] => {
    const imeshActual = imesh instanceof ManagedInstancedMesh ? imesh : imesh.current!

    const instances = new Array<Instance>()

    for (let i = 0; i < count; i++) {
        instances.push(imeshActual.addInstance(factory()))
    }

    const cleanup = () => {
        for (let i = 0; i < count; i++) {
            imeshActual.removeInstance(instances[i])
        }
    }

    return [instances, cleanup]
}