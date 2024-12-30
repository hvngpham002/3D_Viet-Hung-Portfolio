/* eslint-disable @typescript-eslint/naming-convention */
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

export type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh | THREE.SkinnedMesh>;
  materials: Record<string, THREE.Material>;
  animations: THREE.AnimationClip[];
};