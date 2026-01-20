
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env is handled correctly by Vite during the build step
    'process.env': JSON.stringify(process.env)
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
