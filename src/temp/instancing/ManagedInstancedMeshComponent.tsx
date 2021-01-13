import {forwardRef, useState} from "react";
import {ManagedInstancedMesh} from "./ManagedInstancedMesh";
import {BufferGeometry, Geometry, Material} from "three";

export const ManagedInstancedMeshComponent = forwardRef<
    ManagedInstancedMesh,
    { children: any, maxInstances: number, geometry: BufferGeometry, material: Material }
    >(({ children, geometry, material, maxInstances, ...props }, ref) => {
    const [imesh] = useState(
        () => new ManagedInstancedMesh(geometry!, material!, maxInstances)
    )

    // const forwardEventToInstance = (eventName: string) => (e: TrinityPointerEvent) => {
    //     const instanceId = e.intersection.instanceId
    //     if (!instanceId) return
    //
    //     const instance = imesh.instances[instanceId]
    //     const object = instance?.object
    //     const handlers = (object as ThreeObjectWithOptionalEventHandlers)?.__handlers
    //     handlers && handlers[eventName]?.(e)
    // }

    return (
        <primitive
            ref={ref}
            object={imesh}
            // onPointerUp={forwardEventToInstance("pointerup")}
            // onPointerDown={forwardEventToInstance("pointerdown")}
            // onPointerEnter={forwardEventToInstance("pointerenter")}
            // onPointerLeave={forwardEventToInstance("pointerleave")}
            // onPointerMove={forwardEventToInstance("pointermove")}
            {...props}
        >
            {children}
        </primitive>
    )
})