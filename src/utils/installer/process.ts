import { i18n } from '@/i18n';
import { formatUnknownError } from '../errors';
import { ipc } from '../invokeIpc';
import { logError } from '../logging';

export async function ensureAviutlClosed(): Promise<void> {
  let running = false;
  try {
    running = !!(await ipc.isAviutlRunning());
  } catch (e: unknown) {
    const detail = formatUnknownError(e) || i18n.t('common:errors.unknown');
    try {
      await logError(`[process-check] failed to query process state: ${detail}`);
    } catch {}
    throw new Error(i18n.t('common:process.checkFailed', { detail }), { cause: e });
  }
  if (running) {
    try {
      await logError('[process-check] aviutl2.exe is running; aborting operation.');
    } catch {}
    throw new Error(i18n.t('common:process.running'));
  }
}
