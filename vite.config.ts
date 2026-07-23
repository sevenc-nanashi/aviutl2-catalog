/// <reference types="node" />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig(() => {
  const target: 'desktop' | 'web' = process.env.VITE_TARGET === 'desktop' ? 'desktop' : 'web';
  const isWeb = target === 'web';
  return {
    plugins: [
      isWeb &&
        cloudflare({
          // NOTE: なぜかデフォルトのEnvironmentだと動かないのでworkaround
          viteEnvironment: {
            name: 'ssr',
          },
        }),
      reactRouter(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: `${import.meta.dirname}/src`,
        },
        {
          find: '../dist/server/index.js',
          replacement: 'virtual:react-router/server-build',
        },
      ],
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
  };
});
