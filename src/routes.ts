import { type RouteConfig, RouteConfigEntry, index, layout, route } from '@react-router/dev/routes';
import { isDesktop } from './lib/target';

export default [
  // isDesktop && route('/desktop-entry', 'DesktopBootstrap.tsx'),
  // isDesktop &&
  //   layout('./layouts/init-setup/layout.tsx', [route('/init-setup', 'features/init-setup/ui/InitSetupPage.tsx')]),
  isDesktop && index('./DesktopBootstrap.tsx'),
  isDesktop &&
    layout('./layouts/init-setup/layout.tsx', [route('/init-setup', 'features/init-setup/ui/InitSetupPage.tsx')]),
  layout('./layouts/app-shell/layout.tsx', [
    isDesktop ? route('/home', './features/home/ui/HomePage.tsx') : index('./features/home/ui/HomePage.tsx'),
    route(
      '/package/:id',
      isDesktop ? './features/package/ui/PackagePage.tsx' : './features/package/ui/WebPackagePage.tsx',
    ),
    route('/links', './features/links/ui/LinksPage.tsx'),
    route('/updates', './features/updates/ui/UpdatesPage.tsx'),
    route('/settings', './features/settings/ui/SettingsPage.tsx'),
    route('/register', './features/register/ui/RegisterPage.tsx'),
    route('/feedback', './features/feedback/ui/FeedbackPage.tsx'),
    route('/niconi-commons', './features/niconi-commons/ui/NiconiCommonsPage.tsx'),
  ]),
  route('*?', isDesktop ? './features/not-found/NotFoundPage.tsx' : './features/not-found/WebNotFoundPage.tsx'),
].filter((r): r is RouteConfigEntry => Boolean(r)) satisfies RouteConfig;
