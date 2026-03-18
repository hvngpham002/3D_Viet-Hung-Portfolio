import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'analyze' ? [visualizer({
      filename: './stats.html',
      open: true,
      brotliSize: true,
    })] : []),
  ],
  assetsInclude: ['**/*.glb'],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'EVAL' && warning.id?.includes('three-stdlib')) return;
        defaultHandler(warning);
      },
      output: {
        manualChunks: (id) => {
          // Only split pure Three.js libs — they have no React dependency
          if (id.includes('node_modules/three-stdlib')) {
            return 'three-stdlib';
          }
          if (id.includes('node_modules/three/')) {
            return 'three-core';
          }
          // Everything else (React, react-dom, @react-three, i18next, framer-motion, etc.)
          // stays in vendor to avoid splitting React across chunks
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5174,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
}));
