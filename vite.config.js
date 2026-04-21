import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      svgr(),
      // Вырезали checker полностью, чтобы Vite вообще не знал про ESLint
    ],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'https://queue-system-api.onrender.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@static': path.resolve(__dirname, './src/static')
      },
    }
  };
});