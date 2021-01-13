import React, {useRef} from "react"
import BambooTall from "../../../../3d/components/Bamboo/BambooTall";
import {degToRad} from "../../../../utils/angles";
import BambooMedium from "../../../../3d/components/Bamboo/BambooMedium";
import { ManagedInstancedMeshComponent } from "../../../../temp/instancing/ManagedInstancedMeshComponent";
import {DodecahedronBufferGeometry, MeshBasicMaterial} from "three";
import {ManagedInstancedMesh} from "../../../../temp/instancing/ManagedInstancedMesh";
import {SingleInstance} from "../../../../temp/instancing/SingleInstance";

const geometry = new DodecahedronBufferGeometry()
const material = new MeshBasicMaterial()

const Bamboo: React.FC = () => {

    const imeshRef = useRef<ManagedInstancedMesh>(null)

    return (
        <ManagedInstancedMeshComponent ref={imeshRef} geometry={geometry} material={material} maxInstances={10}>
            <SingleInstance imeshRef={imeshRef} position={[0, 0]}/>
            <SingleInstance imeshRef={imeshRef} position={[2, 0]}/>
        </ManagedInstancedMeshComponent>
    )
    // return (
    //     <>
    //         <BambooTall rotation={[degToRad(90), degToRad(90), 0]} scale={[0.95, 0.95, 0.95]}/>
    //         <BambooTall rotation={[degToRad(90), 0, 0]} position={[0, 0.5, 0]}/>
    //         <BambooMedium rotation={[degToRad(90), 0, 0]} position={[0, 1, 0.5]}/>
    //     </>
    // )
}

export default Bamboo