// oxlint-disable-next-line import/no-unassigned-import
import '../worker-configuration.d.ts';
import { createRequestHandler } from 'react-router';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () =>
    // @ts-expect-error ビルド時に書き換わる
    import('virtual:react-router/server-build'),
  // @ts-expect-error ビルド時に書き換わる
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
