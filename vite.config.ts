import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './stats.html',
      open: true,
      brotliSize: true,
    }),
  ],
  assetsInclude: ['**/*.glb']
})
