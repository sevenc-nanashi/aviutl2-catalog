import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import * as tauriDialog from '@tauri-apps/plugin-dialog';
import { useTranslation } from 'react-i18next';
import { changeUiLocale, getCurrentUiLocale, i18n, type SupportedUiLocale } from '@/i18n';
import { DEFAULT_APP_THEME, updateAppSettings } from '@/utils/appSettings';
import { ipc } from '@/utils/invokeIpc';
import { getSettings } from '@/utils/settings';
import { fetchWindowLabel, getErrorMessage, safeLog } from '../../model/helpers';
import type { InitSetupStep, InstalledChoice, PickDirKind } from '../../model/types';

export default function useInitSetupFlow() {
  const { t } = useTranslation('initSetup');
  const [step, setStep] = useState<InitSetupStep>('intro');
  const [installed, setInstalled] = useState<InstalledChoice>(null);
  const [aviutlRoot, setAviutlRoot] = useState('');
  const [portable, setPortable] = useState(false);
  const [installDir, setInstallDir] = useState('');
  const [savingInstallDetails, setSavingInstallDetails] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState('');
  const [localeBusy, setLocaleBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const suggested = await ipc.defaultAviutl2Root();
        if (cancelled) return;
        const value = typeof suggested === 'string' ? suggested.trim() : '';
        if (value) {
          setAviutlRoot((prev) => prev || value);
          setInstallDir((prev) => prev || value);
        }
      } catch (fetchError) {
        await safeLog('[init-window] default aviutl2 root load failed', fetchError);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    root.classList.add('dark');
    const raf = requestAnimationFrame(() => {
      root.classList.remove('theme-init');
    });
    return () => {
      cancelAnimationFrame(raf);
      if (!hadDark) root.classList.remove('dark');
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchWindowLabel().then((value) => {
      if (!cancelled) setLabel(String(value || ''));
      return value;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persistAviutlSettings = useCallback(
    async (rootPath: string, portableMode: boolean) => {
      const normalized = rootPath.trim();
      if (!normalized) throw new Error(t('errors.aviutlRootRequired'));
      let resolved = normalized;
      try {
        const candidate = await ipc.resolveAviutl2Root({ raw: normalized });
        if (candidate) resolved = String(candidate);
      } catch (resolveError) {
        await safeLog('[init-window] resolve aviutl2 root failed', resolveError);
      }
      try {
        const updated = await updateAppSettings({
          aviutl2Root: resolved,
          isPortableMode: portableMode,
          theme: DEFAULT_APP_THEME,
          locale: getCurrentUiLocale(i18n),
        });
        if (!updated) throw new Error(t('errors.aviutlRootRequired'));
      } catch (updateErrorInner) {
        await safeLog('[init-window] update_settings invoke failed', updateErrorInner);
        throw updateErrorInner;
      }
      setAviutlRoot(resolved);
      return resolved;
    },
    [t],
  );

  const canProceedDetails = useCallback(() => {
    if (installed === true) return Boolean(aviutlRoot.trim());
    if (installed === false) return Boolean(installDir.trim());
    return false;
  }, [aviutlRoot, installDir, installed]);

  const proceedInstalled = useCallback((choice: boolean) => {
    setInstalled(choice);
    setStep('details');
    setError('');
  }, []);

  const pickDir = useCallback(
    async (kind: PickDirKind) => {
      try {
        const title = kind === 'install' ? t('errors.pickInstallDir') : t('errors.pickExistingDir');
        const path = await tauriDialog.open({ directory: true, multiple: false, title });
        if (!path || Array.isArray(path)) return;
        const value = String(path);
        if (kind === 'install') setInstallDir(value);
        else setAviutlRoot(value);
        setError('');
      } catch {
        setError(t('errors.pickDirFailed'));
      }
    },
    [t],
  );

  const finalizeSetup = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      await ipc.completeInitialSetup();
    } catch (finalizeError) {
      setError(getErrorMessage(finalizeError) || t('errors.finalizeFailed'));
    } finally {
      setBusy(false);
    }
  }, [t]);

  const changeLocale = useCallback(
    async (nextLocale: SupportedUiLocale) => {
      const currentLocale = getCurrentUiLocale(i18n);
      if (currentLocale === nextLocale) return;
      setLocaleBusy(true);
      try {
        await changeUiLocale(nextLocale);
      } catch (languageError) {
        await safeLog('[init-window] changeLanguage failed', languageError);
      }

      try {
        const draftRoot = String((installed === true ? aviutlRoot : installDir) || '').trim();
        const persisted = await getSettings();
        await updateAppSettings({
          aviutl2Root: draftRoot || undefined,
          isPortableMode: typeof persisted.is_portable_mode === 'boolean' ? persisted.is_portable_mode : portable,
          locale: nextLocale,
        });
      } catch (persistError) {
        await safeLog('[init-window] locale persistence failed', persistError);
      } finally {
        setLocaleBusy(false);
      }
    },
    [aviutlRoot, installDir, installed, portable],
  );

  return {
    step,
    setStep,
    installed,
    aviutlRoot,
    setAviutlRoot,
    portable,
    setPortable,
    installDir,
    setInstallDir,
    savingInstallDetails,
    setSavingInstallDetails,
    error,
    setError,
    busy,
    label,
    localeBusy,
    persistAviutlSettings,
    canProceedDetails,
    proceedInstalled,
    pickDir,
    finalizeSetup,
    changeLocale,
  };
}
