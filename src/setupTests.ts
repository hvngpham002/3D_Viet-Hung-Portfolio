/* eslint-disable @typescript-eslint/naming-convention */
import '@testing-library/jest-dom';
import React from 'react';

// Mock canvas and WebGL since Jest doesn't support them
jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  Canvas: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
}));

// Mock any Three.js specific functionality
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});