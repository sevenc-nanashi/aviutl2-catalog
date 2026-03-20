import { redirect } from 'react-router';
import { detectWindowLabel } from './bootstrap/window';

export async function clientLoader() {
  const label = await detectWindowLabel();
  if (label === 'init-setup') {
    throw redirect('/init-setup');
  } else {
    throw redirect('/home');
  }
}

export default function DesktopBootstrap() {
  return null;
}
