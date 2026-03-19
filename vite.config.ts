import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 5173,
    watch: {
      ignored: ['./target/**'],
    },
  },
  optimizeDeps: {
    // 開発環境では重い Tauri プラグインの事前バンドルを避ける（遅延ロードされる）
    exclude: [
      '@tauri-apps/plugin-dialog',
      '@tauri-apps/plugin-fs',
      '@tauri-apps/plugin-http',
      '@tauri-apps/plugin-shell',
    ],
  },
});
