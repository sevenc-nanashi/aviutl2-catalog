import { useCallback, useEffect, useState } from 'react';
import * as tauriDialog from '@tauri-apps/plugin-dialog';
import * as tauriProcess from '@tauri-apps/plugin-process';
import * as tauriUpdater from '@tauri-apps/plugin-updater';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils/logging';

export interface UseUpdatePromptOptions {
  autoCheck?: boolean;
}

export interface UpdatePromptInstallable {
  downloadAndInstall: () => Promise<void>;
}

interface UpdateCheckResult extends UpdatePromptInstallable {
  available?: boolean;
  version?: string;
  body?: string;
  notes?: string;
  pubDate?: string;
  publishDate?: string;
  publishedAt?: string;
  releaseDate?: string;
  date?: string;
}

export interface UpdatePromptInfo {
  update: UpdatePromptInstallable;
  version: string;
  notes: string;
  publishedOn: string;
}

export interface UseUpdatePromptResult {
  updateInfo: UpdatePromptInfo | null;
  updateBusy: boolean;
  updateError: string;
  dismissUpdate: () => void;
  confirmUpdate: () => Promise<void>;
}

type UpdateDialogTranslationKey = 'updateDialog.appliedMessage' | 'updateDialog.eyebrow';
type UpdateDialogTranslator = (key: UpdateDialogTranslationKey) => string;

function toErrorText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return String(error ?? 'unknown');
}

function toCleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function resolvePublishedOn(update: UpdateCheckResult | null | undefined): string {
  if (!update || typeof update !== 'object') return '';
  const candidates = [update.pubDate, update.publishDate, update.publishedAt, update.releaseDate, update.date];
  return candidates.map(toCleanString).find(Boolean) || '';
}

async function notifyUpdateApplied(t: UpdateDialogTranslator): Promise<void> {
  try {
    await tauriProcess.relaunch();
  } catch {
    try {
      await tauriDialog.message(t('updateDialog.appliedMessage'), {
        title: t('updateDialog.eyebrow'),
        kind: 'info',
      });
    } catch {}
  }
}

export function useUpdatePrompt(options: UseUpdatePromptOptions = {}): UseUpdatePromptResult {
  const { autoCheck = true } = options;
  const { t } = useTranslation('common');
  const [updateInfo, setUpdateInfo] = useState<UpdatePromptInfo | null>(null);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!autoCheck) return undefined;
    if (import.meta.env.DEV) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const update = await tauriUpdater.check();
        if (!cancelled && update) {
          const notes = toCleanString(update.body);
          const publishedOn = resolvePublishedOn(update);

          setUpdateError('');
          setUpdateInfo({
            update,
            version: toCleanString(update.version),
            notes,
            publishedOn,
          });
        }
      } catch (error) {
        await logError(`[updater] check failed: ${toErrorText(error)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoCheck]);

  const dismissUpdate = useCallback(() => {
    if (updateBusy) return;
    setUpdateInfo(null);
    setUpdateError('');
  }, [updateBusy]);

  const confirmUpdate = useCallback(async () => {
    if (!updateInfo?.update) return;
    setUpdateBusy(true);
    setUpdateError('');
    try {
      await updateInfo.update.downloadAndInstall();
      await notifyUpdateApplied(t);
      setUpdateInfo(null);
    } catch (error) {
      setUpdateError(t('updateDialog.failed'));
      await logError(`[updater] download/install failed: ${toErrorText(error)}`);
    } finally {
      setUpdateBusy(false);
    }
  }, [t, updateInfo]);

  return {
    updateInfo,
    updateBusy,
    updateError,
    dismissUpdate,
    confirmUpdate,
  };
}
