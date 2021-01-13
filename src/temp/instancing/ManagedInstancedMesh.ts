import {Color, InstancedMesh, Object3D} from "three";

export type Instance = {
    object: Object3D
    color?: Color
    index: number
    data?: any
}

/* Our ManagedInstancedMesh class that we can use with just plain old Three.js */
export class ManagedInstancedMesh extends InstancedMesh {
    instances: Instance[] = []

    addInstance({ object, color, data = {} }: Pick<Instance, "color" | "object" | "data">): Instance {
        const instance: Instance = {
            object,
            color,
            data,
            index: this.instances.length
        }

        /* Store instance */
        this.instances.push(instance)

        /* Brute-force update instance so it definitely gets applied to our matrices */
        this.updateInstance(instance, instance)

        /* Update instance count */
        this.count = this.instances.length

        return instance
    }

    removeInstance(instance: Instance) {
        /* Remove instance from our instance list */
        this.instances = this.instances.filter((i) => i !== instance)

        /* Regenerate indices */
        this.instances.forEach((instance, index) => (instance.index = index))
    }

    updateInstance(instance: Instance, updates: Partial<Pick<Instance, "color" | "object">> = {}) {
        /* Store new object if one was given */
        if (updates.object !== undefined) instance.object = updates.object

        /* Update the instance's matrix and store it. */
        instance.object.updateMatrix()
        this.setMatrixAt(instance.index, instance.object.matrix)

        /* Apply new color if one was given */
        if (updates.color !== undefined) {
            instance.color = updates.color
            this.setColorAt(instance.index, updates.color)
            this.instanceColor!.needsUpdate = true
        }

        this.instanceMatrix.needsUpdate = true
    }
}