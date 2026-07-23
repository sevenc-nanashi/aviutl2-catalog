import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { safeLog } from '../../model/helpers';
import type { SetupConfig } from '../../model/types';

const SETUP_REMOTE_URL = import.meta.env.VITE_SETUP_REMOTE;
const setupConfigResponseSchema = z.object({
  corePackageId: z.string().trim().min(1),
  requiredPluginIds: z.array(z.string().trim().min(1)).min(1),
});

export default function useInitSetupConfig() {
  const { t } = useTranslation('initSetup');
  const [setupConfig, setSetupConfig] = useState<SetupConfig | null>(null);
  const [setupError, setSetupError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(SETUP_REMOTE_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = await response.json();
        const parsed = setupConfigResponseSchema.safeParse(raw);
        if (!parsed.success) {
          throw new Error('invalid payload');
        }
        const { corePackageId, requiredPluginIds } = parsed.data;
        if (cancelled) return;
        setSetupConfig({ corePackageId, requiredPluginIds });
        setSetupError('');
      } catch (fetchError) {
        if (!cancelled) {
          setSetupConfig(null);
          setSetupError(t('errors.networkRequired'));
        }
        await safeLog('[init-window] setup config load failed', fetchError);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const requiredPluginIds = setupConfig?.requiredPluginIds ?? [];
  const corePackageId = setupConfig?.corePackageId ?? '';

  return {
    setupConfig,
    setupError,
    requiredPluginIds,
    corePackageId,
  };
}
