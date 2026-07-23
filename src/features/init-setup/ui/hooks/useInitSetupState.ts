import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../model/helpers';
import { useUpdatePrompt } from '@/features/app-update/useUpdatePrompt';
import useInitSetupBulkInstall from './useInitSetupBulkInstall';
import useInitSetupConfig from './useInitSetupConfig';
import useInitSetupFlow from './useInitSetupFlow';
import useInitSetupPackageCatalog from './useInitSetupPackageCatalog';

export default function useInitSetupState() {
  const { t } = useTranslation('initSetup');
  const flow = useInitSetupFlow();
  const config = useInitSetupConfig();
  const catalog = useInitSetupPackageCatalog({
    step: flow.step,
    requiredPluginIds: config.requiredPluginIds,
    corePackageId: config.corePackageId,
  });
  const bulk = useInitSetupBulkInstall({
    allRequiredInstalled: catalog.allRequiredInstalled,
    requiredPackages: catalog.requiredPackages,
    downloadRequiredPackage: catalog.downloadRequiredPackage,
    onDone: () => {
      flow.setStep('done');
    },
  });

  const { updateInfo, updateBusy, updateError, confirmUpdate, dismissUpdate } = useUpdatePrompt();

  async function runDetailsNext({
    rootPath,
    emptyMessage,
    failureTitle,
    afterSave,
  }: {
    rootPath: string;
    emptyMessage: string;
    failureTitle: string;
    afterSave?: () => Promise<void>;
  }) {
    if (flow.savingInstallDetails || !flow.canProceedDetails()) return;
    flow.setError('');
    flow.setSavingInstallDetails(true);
    try {
      const normalized = rootPath.trim();
      if (!normalized) {
        flow.setError(emptyMessage);
        return;
      }
      await flow.persistAviutlSettings(normalized, flow.portable);
      if (afterSave) {
        await afterSave();
      }
      flow.setStep('packages');
    } catch (detailsError) {
      const detail = getErrorMessage(detailsError);
      flow.setError(detail ? `${failureTitle}\n${detail}` : failureTitle);
    } finally {
      flow.setSavingInstallDetails(false);
    }
  }

  async function handleExistingDetailsNext() {
    await runDetailsNext({
      rootPath: flow.aviutlRoot,
      emptyMessage: t('errors.aviutlRootRequired'),
      failureTitle: t('errors.saveFailed'),
    });
  }

  async function handleInstallDetailsNext() {
    await runDetailsNext({
      rootPath: flow.installDir,
      emptyMessage: t('errors.installDirRequired'),
      failureTitle: t('errors.setupFailed'),
      afterSave: async () => {
        const success = await catalog.downloadRequiredPackage(config.corePackageId);
        if (!success) throw new Error(t('errors.installFailed'));
      },
    });
  }

  return {
    step: flow.step,
    setStep: flow.setStep,
    installed: flow.installed,
    aviutlRoot: flow.aviutlRoot,
    setAviutlRoot: flow.setAviutlRoot,
    portable: flow.portable,
    setPortable: flow.setPortable,
    installDir: flow.installDir,
    setInstallDir: flow.setInstallDir,
    savingInstallDetails: flow.savingInstallDetails,
    error: flow.error,
    busy: flow.busy,
    label: flow.label,
    localeBusy: flow.localeBusy,
    setupConfig: config.setupConfig,
    setupError: config.setupError,
    requiredPackages: catalog.requiredPackages,
    packageVersions: catalog.packageVersions,
    allRequiredInstalled: catalog.allRequiredInstalled,
    packagesLoading: catalog.packagesLoading,
    packagesError: catalog.packagesError,
    packagesDownloadError: bulk.packagesDownloadError,
    bulkDownloading: bulk.bulkDownloading,
    coreProgressRatio: catalog.coreProgressRatio,
    handleBulkInstallAndNext: bulk.handleBulkInstallAndNext,
    handleExistingDetailsNext,
    handleInstallDetailsNext,
    proceedInstalled: flow.proceedInstalled,
    pickDir: flow.pickDir,
    finalizeSetup: flow.finalizeSetup,
    changeLocale: flow.changeLocale,
    canProceedDetails: flow.canProceedDetails,
    updateInfo,
    updateBusy,
    updateError,
    confirmUpdate,
    dismissUpdate,
  };
}
