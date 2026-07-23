import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as tauriDialog from '@tauri-apps/plugin-dialog';
import {
  buildAu2pkgInstallSteps,
  buildAu2pkgUninstallSteps,
  collectAu2pkgEntries,
  isAu2pkgFileName,
  summarizeAu2pkgFiles,
} from '../../model/au2pkg';
import { basename, generateKey, getErrorMessage } from '../../model/helpers';
import type { Au2pkgImportSummary } from '../../model/au2pkg';
import type { RegisterInstallStep, RegisterUninstallStep } from '../../model/types';
import { ipc } from '@/utils/invokeIpc';

interface UseRegisterPackageFileImportArgs {
  replaceInstallSteps: (steps: RegisterInstallStep[]) => void;
  replaceUninstallSteps: (steps: RegisterUninstallStep[]) => void;
}

function toKeyedInstallSteps(steps: ReturnType<typeof buildAu2pkgInstallSteps>): RegisterInstallStep[] {
  return steps.map((step) => ({ key: generateKey(), ...step }));
}

function toKeyedUninstallSteps(steps: ReturnType<typeof buildAu2pkgUninstallSteps>): RegisterUninstallStep[] {
  return steps.map((step) => ({ key: generateKey(), ...step }));
}

function toFriendlyErrorMessage(error: unknown, unavailableMessage: string, fallbackMessage: string): string {
  const rawMessage = getErrorMessage(error);
  if (/module/i.test(rawMessage)) {
    return unavailableMessage;
  }
  return rawMessage || fallbackMessage;
}

export default function useRegisterPackageFileImport({
  replaceInstallSteps,
  replaceUninstallSteps,
}: UseRegisterPackageFileImportArgs) {
  const { t } = useTranslation('register');
  const [selectedPackageFileName, setSelectedPackageFileName] = useState('');
  const [packageFileSummary, setPackageFileSummary] = useState<Au2pkgImportSummary | null>(null);
  const [packageFileError, setPackageFileError] = useState('');
  const [packageFileImporting, setPackageFileImporting] = useState(false);

  const importPackageFileFromPath = useCallback(
    async (selectedPath: string) => {
      const normalizedPath = String(selectedPath || '').trim();
      if (!normalizedPath) return;

      setPackageFileImporting(true);
      setPackageFileError('');
      try {
        if (!isAu2pkgFileName(normalizedPath)) {
          throw new Error(t('errors.packageFileExtension'));
        }
        const entries = await ipc.listZipEntries({ zipPath: normalizedPath });
        const files = collectAu2pkgEntries(entries);
        if (!files.length) {
          throw new Error(t('errors.packageFileNoCopyTargets'));
        }
        replaceInstallSteps(toKeyedInstallSteps(buildAu2pkgInstallSteps(files)));
        replaceUninstallSteps(toKeyedUninstallSteps(buildAu2pkgUninstallSteps(files)));
        setSelectedPackageFileName(basename(normalizedPath));
        setPackageFileSummary(summarizeAu2pkgFiles(files));
      } catch (error) {
        setPackageFileError(
          toFriendlyErrorMessage(error, t('errors.packageFileUnavailable'), t('errors.packageFileParseFailed')),
        );
      } finally {
        setPackageFileImporting(false);
      }
    },
    [replaceInstallSteps, replaceUninstallSteps, t],
  );

  const handleSelectPackageFile = useCallback(async () => {
    try {
      const selection = await tauriDialog.open({
        multiple: false,
        title: t('installer.packageFileTitle'),
      });
      const selectedPath = Array.isArray(selection) ? selection[0] : selection;
      if (!selectedPath || typeof selectedPath !== 'string') return;
      await importPackageFileFromPath(selectedPath);
    } catch (error) {
      setPackageFileError(
        toFriendlyErrorMessage(error, t('errors.packageFileUnavailable'), t('errors.packageFileParseFailed')),
      );
    }
  }, [importPackageFileFromPath, t]);

  const resetPackageFileImport = useCallback(() => {
    setSelectedPackageFileName('');
    setPackageFileSummary(null);
    setPackageFileError('');
    setPackageFileImporting(false);
  }, []);

  return {
    selectedPackageFileName,
    packageFileSummary,
    packageFileError,
    packageFileImporting,
    handleSelectPackageFile,
    resetPackageFileImport,
  };
}
