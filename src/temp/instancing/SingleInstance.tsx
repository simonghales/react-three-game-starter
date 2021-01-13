import {FC, RefObject, useRef} from "react";
import {ManagedInstancedMesh} from "./ManagedInstancedMesh";
import {Object3D} from "three";
import {useInstance} from "./hooks";
import {degToRad} from "../../utils/angles";

export const SingleInstance: FC<{
    imeshRef: RefObject<ManagedInstancedMesh>,
    position: [number, number]
}> = ({ imeshRef, position }) => {
    /* Reference to a scene object we will be rendering below */
    const ref = useRef<Object3D>(null)

    /* Create an instance with a random color. The factory function will run as a side-effect
       after React is done rendering, so we're safe to use our refs here. */
    const instanceRef = useInstance(imeshRef, () => ({
        object: ref.current!,
    }))

    /* Here's our scene object that acts as a facade for the actual instance. Use it like
       any other scene object. */
    return (
        // @ts-ignore
        <object3D
            ref={ref}
            position={[position[0], position[1], 0]}
            rotation={[degToRad(90), 0, 0]}
        />
    )
}