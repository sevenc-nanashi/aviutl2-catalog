import { isDesktop } from '@/lib/target';
import * as windowApi from '@tauri-apps/api/window';
import { useEffect } from 'react';

async function showMainWindow() {
  const win = windowApi.getCurrentWindow();
  await win.show();
  await win.setFocus();
}

export function useShowMainWindow() {
  useEffect(() => {
    if (isDesktop) {
      setTimeout(() => {
        void showMainWindow();
      }, 0);
    }
  }, []);
}
