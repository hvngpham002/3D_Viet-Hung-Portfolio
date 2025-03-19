/* eslint-disable @typescript-eslint/naming-convention */
// Basic Three.js mock
const mockThree = {
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    setClearColor: jest.fn(),
    domElement: document.createElement("canvas"),
  })),
  // Add more Three.js classes/methods as needed
};

export default mockThree;
