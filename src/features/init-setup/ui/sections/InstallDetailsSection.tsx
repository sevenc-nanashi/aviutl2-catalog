import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProgressCircle from '@/components/ProgressCircle';
import DetailsSectionBase from '../components/DetailsSectionBase';
import type { InstallDetailsSectionProps } from '../types';
import { layout } from '@/components/ui/_styles';

export default function InstallDetailsSection({
  installDir,
  portable,
  savingInstallDetails,
  canProceed,
  coreProgressRatio,
  onInstallDirChange,
  onPortableChange,
  onPickInstallDir,
  onBack,
  onNext,
}: InstallDetailsSectionProps) {
  const { t } = useTranslation('initSetup');
  const header = useMemo(
    () => ({
      title: t('details.install.title'),
      description: t('details.install.description'),
    }),
    [t],
  );
  const input = useMemo(
    () => ({
      inputId: 'setup-install-dir',
      inputLabel: t('details.install.label'),
      inputLabelClassName: 'text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1',
      inputValue: installDir,
      inputPlaceholder: 'C:\\path\\to\\install',
      pickButtonTitle: t('common:actions.browse'),
      onInputChange: onInstallDirChange,
      onPickDir: onPickInstallDir,
    }),
    [installDir, onInstallDirChange, onPickInstallDir, t],
  );
  const portableOptions = useMemo(
    () => ({
      portable,
      standardLabel: t('details.standard'),
      portableActiveClassName: 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500',
      portableSectionClassName: 'space-y-3 pt-2',
      onPortableChange,
    }),
    [onPortableChange, portable, t],
  );
  const actions = useMemo(
    () => ({
      savingInstallDetails,
      canProceed,
      onBack,
      onNext,
      savingContent: (
        <span className={layout.inlineGap2}>
          <ProgressCircle
            value={coreProgressRatio}
            size={16}
            strokeWidth={4}
            ariaLabel={t('details.install.progressAria')}
            className="text-white"
          />
          {t('details.install.installing')}
        </span>
      ),
      idleContent: (
        <span className={layout.inlineGap2}>
          <Download size={18} />
          {t('details.install.next')}
        </span>
      ),
    }),
    [canProceed, coreProgressRatio, onBack, onNext, savingInstallDetails, t],
  );

  return <DetailsSectionBase header={header} input={input} portable={portableOptions} actions={actions} />;
}
