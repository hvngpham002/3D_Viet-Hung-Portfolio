/* eslint-disable @typescript-eslint/naming-convention */
import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import flagScene from "../assets/3d/flag-optimized.glb";

type GLTFResult = GLTF & {
  nodes: {
    Flag_PoleShape_2_0: THREE.Mesh;
    outputCloth1: THREE.Mesh;
  };
  materials: {
    Flag_PoleShape: THREE.Material;
    outputCloth1: THREE.Material;
  };
};

type FlagProps = JSX.IntrinsicElements["group"];

const Flag = (props: FlagProps) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(flagScene) as GLTFResult;

  // Fix animation tracks to match our node names
  const fixedAnimations = animations.map((clip) => {
    const tracks = clip.tracks.map((track) => {
      // Replace the track names to match our model's structure
      if (track.name.includes("morphTargetInfluences")) {
        const newTrack = track.clone();
        newTrack.name = track.name.replace(
          /outputCloth1_[123]\.morphTargetInfluences/,
          "outputCloth1.morphTargetInfluences"
        );
        return newTrack;
      }
      return track;
    });

    return new THREE.AnimationClip(clip.name, clip.duration, tracks);
  });

  const { actions } = useAnimations(fixedAnimations, group);

  useEffect(() => {
    // Convert materials first
    if (materials) {
      Object.values(materials).forEach((material) => {
        const mat = material as THREE.Material & {
          specular?: THREE.Color;
          glossiness?: number;
          metalness?: number;
          roughness?: number;
        };

        if (mat.specular) {
          mat.metalness = 0.5;
          mat.roughness = 0.5;
          delete mat.specular;
          delete mat.glossiness;
        }

        if (material instanceof THREE.Material) {
          material.side = THREE.DoubleSide;
          material.shadowSide = THREE.DoubleSide;
          material.needsUpdate = true;
        }
      });
    }

    // Play animation
    if (actions["Object_0"]) {
      actions["Object_0"].play();
    }

    // Ensure morph targets are properly set up
    if (group.current) {
      group.current.traverse((child) => {
        if (child.name === "outputCloth1" && child instanceof THREE.Mesh) {
          child.morphTargetInfluences = child.morphTargetInfluences || [];
          child.visible = true;
        } else if (child.name.includes("outputCloth1")) {
          child.visible = false;
        }
      });
    }
  }, [actions, materials, group]);

  return (
    <group ref={group} {...props}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
            <group name="efdac025f3e348f4887637f052ec3ddaabccleanermaterialmergergles">
              <group name="Object_2" rotation={[Math.PI, 0, 0]}>
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
                    scale={[1.333, 2.09, 3.123]}
                  >
                    <group name="MorphMainGroup">
                      <mesh
                        name="outputCloth1"
                        castShadow
                        receiveShadow
                        geometry={nodes.outputCloth1.geometry}
                        material={materials.outputCloth1}
                        morphTargetDictionary={
                          nodes.outputCloth1.morphTargetDictionary
                        }
                        morphTargetInfluences={
                          nodes.outputCloth1.morphTargetInfluences
                        }
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default Flag;

useGLTF.preload(flagScene);
