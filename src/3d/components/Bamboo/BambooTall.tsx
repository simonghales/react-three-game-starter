/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder016: THREE.Mesh
    Cylinder016_1: THREE.Mesh
  }
  materials: {
    Green: THREE.MeshStandardMaterial
    DarkGreen2: THREE.MeshStandardMaterial
  }
}

export default function BambooTall(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/Bamboo_4.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh material={materials.Green} geometry={nodes.Cylinder016.geometry} castShadow />
      <mesh material={materials.DarkGreen2} geometry={nodes.Cylinder016_1.geometry} castShadow />
    </group>
  )
}

useGLTF.preload('/models/Bamboo_4.glb')
