import * as tauriFs from '@tauri-apps/plugin-fs';
import * as z from 'zod';
import { formatUnknownError } from './errors';
import { logError } from './logging';
import { isWeb } from '@/lib/target';

const SETTINGS_FILE = 'settings.json';
const settingsFileSchema = z.object({
  theme: z.string().optional(),
  aviutl2_root: z.string().optional(),
  is_portable_mode: z.boolean().optional(),
  package_state_opt_out: z.boolean().optional(),
  package_updates_paused_ids: z.array(z.string()).optional(),
});

export type AppSettings = z.infer<typeof settingsFileSchema>;

export async function getSettings(): Promise<AppSettings> {
  if (isWeb) {
    try {
      const raw = localStorage.getItem(SETTINGS_FILE);
      if (!raw) return {};
      const data = JSON.parse(raw);
      const parsed = settingsFileSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data;
      }
      try {
        await logError('[getSettings] invalid localStorage settings shape');
      } catch {}
      return {};
    } catch (e: unknown) {
      try {
        await logError(`[getSettings] localStorage read failed: ${formatUnknownError(e)}`);
      } catch {}
      return {};
    }
  } else {
    try {
      const hasSettings = await tauriFs.exists(SETTINGS_FILE, { baseDir: tauriFs.BaseDirectory.AppConfig });
      if (!hasSettings) return {};
      const raw = await tauriFs.readTextFile(SETTINGS_FILE, { baseDir: tauriFs.BaseDirectory.AppConfig });
      const data = JSON.parse(raw || '{}');
      const parsed = settingsFileSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data;
      }
      try {
        await logError('[getSettings] invalid settings.json shape');
      } catch {}
      return {};
    } catch (e: unknown) {
      try {
        await logError(`[getSettings] failed: ${formatUnknownError(e)}`);
      } catch {}
      return {};
    }
  }
}
