/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three';

import flagScene from "../assets/3d/flag.glb"

const Flag = (props) => {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF(flagScene)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Only play the animation for the main cloth mesh
    if (actions['Object_0']) {
      actions['Object_0'].play();
    }

    // Hide duplicate cloth meshes
    if (group.current) {
      group.current.traverse((child) => {
        if (child.name.includes('outputCloth1')) {
          // Only show the first instance of outputCloth1
          if (child.name === 'outputCloth1') {
            child.visible = true;
          } else {
            child.visible = false;
          }
        }
      });
    }

    // Optimize materials
    Object.values(materials).forEach((material) => {
      if (material instanceof THREE.Material) {
        material.side = THREE.DoubleSide; // Ensure flag is visible from both sides
        material.shadowSide = THREE.DoubleSide; // Proper shadow casting
        material.needsUpdate = true;
      }
    });
  }, [actions, materials, group]);

  return (
    <group ref={group} {...props}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="efdac025f3e348f4887637f052ec3ddaabccleanermaterialmergergles">
            <group name="Object_2" rotation={[Math.PI / 2, 0, 0]}>
              <group name="Object_3">
                <group name="Object_4">
                  <group name="TimeframeMainGroup">
                    <group name="Object_6">
                      <mesh
                        name="Flag_PoleShape_2_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.Flag_PoleShape_2_0.geometry}
                        material={materials.Flag_PoleShape}
                      />
                    </group>
                  </group>
                </group>
                <group
                  name="Object_11"
                  position={[0.098, 2.358, 0.224]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={[1.333, 2.09, 3.123]}>
                  <group name="MorphMainGroup">
                    <mesh
                      name="outputCloth1"
                      castShadow
                      receiveShadow
                      geometry={nodes.outputCloth1.geometry}
                      material={materials.outputCloth1}
                      morphTargetDictionary={nodes.outputCloth1.morphTargetDictionary}
                      morphTargetInfluences={nodes.outputCloth1.morphTargetInfluences}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

export default Flag;

useGLTF.preload(flagScene);