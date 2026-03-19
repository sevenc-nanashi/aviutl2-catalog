import { redirect } from 'react-router';
import { detectWindowLabel } from './bootstrap/window';

async function loggingMiddleware() {
  const label = await detectWindowLabel();
  if (label === 'init-setup') {
    throw redirect('/init-setup');
  } else {
    throw redirect('/home');
  }
}

export const clientMiddleware = [loggingMiddleware];
