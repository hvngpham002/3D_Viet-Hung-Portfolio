// global.d.ts
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.glb" {
  const value: string;
  export default value;
}

// Add declarations for other asset types that might be needed
declare module "*.gltf" {
  const value: string;
  export default value;
}

declare module "*.fbx" {
  const value: string;
  export default value;
}

// Add specific property type declarations for your 3D models
declare module "*/dragon.glb" {
  const value: string;
  export default value;
}

declare module "*/book.glb" {
  const value: string;
  export default value;
}

declare module "*/sky.glb" {
  const value: string;
  export default value;
}

declare module "*/ciri.glb" {
  const value: string;
  export default value;
}

declare module "*/ciri1.glb" {
  const value: string;
  export default value;
}