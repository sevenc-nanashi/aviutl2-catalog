import { useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type MetaFunction } from 'react-router';
import { isDesktop, target } from './lib/target';
// oxlint-disable-next-line import/no-unassigned-import
import '@/styles/index.css';
// eslint-disable-next-line import/no-unassigned-import
import 'markdown-it-github-alerts/styles/github-colors-light.css';
// eslint-disable-next-line import/no-unassigned-import
import 'markdown-it-github-alerts/styles/github-colors-dark-media.css';
// eslint-disable-next-line import/no-unassigned-import
import 'markdown-it-github-alerts/styles/github-base.css';
import TitleBar from './layouts/app-shell/title-bar/TitleBar';
import { getSettings } from './utils/settings';
import { applyTheme, toSettingsForm } from './features/settings/model/helpers';

export const meta: MetaFunction = () => [{ title: 'AviUtl2 カタログ' }];

export default function Layout() {
  useEffect(() => {
    getSettings().then((raw) => {
      applyTheme(toSettingsForm(raw).theme);
    });
  }, []);
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body data-target={target}>
        {isDesktop && <TitleBar />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
