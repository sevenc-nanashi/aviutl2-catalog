/// <reference types="node" />
import type { Config } from '@react-router/dev/config';

const target: 'desktop' | 'web' = process.env.TARGET === 'desktop' ? 'desktop' : 'web';

export default {
  appDirectory: 'src',
  ssr: target === 'web',
  buildDirectory: 'dist',
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
