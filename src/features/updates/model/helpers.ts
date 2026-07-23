import { i18n } from '@/i18n';
import type { InstallerProgressPayload } from './types';

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return i18n.t('common:errors.unknown');
}

export function toProgressRatio(progress: InstallerProgressPayload | null | undefined): number {
  if (!progress || !Number.isFinite(progress.ratio)) return 0;
  return Math.min(1, Math.max(0, Number(progress.ratio)));
}

export function toProgressLabel(progress: InstallerProgressPayload | null | undefined): string {
  if (!progress || typeof progress.label !== 'string' || !progress.label.trim()) {
    return i18n.t('common:status.processing');
  }
  return progress.label;
}
