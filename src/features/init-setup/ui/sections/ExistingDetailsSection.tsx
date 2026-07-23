import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DetailsSectionBase from '../components/DetailsSectionBase';
import type { ExistingDetailsSectionProps } from '../types';
import { action, layout } from '@/components/ui/_styles';

export default function ExistingDetailsSection({
  aviutlRoot,
  portable,
  savingInstallDetails,
  canProceed,
  onAviutlRootChange,
  onPortableChange,
  onPickExistingDir,
  onBack,
  onNext,
}: ExistingDetailsSectionProps) {
  const { t } = useTranslation(['initSetup', 'common']);
  const header = useMemo(
    () => ({
      title: t('details.existing.title'),
      description: t('details.existing.description'),
    }),
    [t],
  );
  const input = useMemo(
    () => ({
      inputId: 'setup-aviutl2-root',
      inputLabel: t('details.existing.label'),
      inputLabelClassName: 'text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 ml-1',
      inputValue: aviutlRoot,
      inputPlaceholder: 'C:\\path\\to\\aviutl',
      pickButtonTitle: t('common:actions.browse'),
      inputHint: t('details.existing.hint'),
      onInputChange: onAviutlRootChange,
      onPickDir: onPickExistingDir,
    }),
    [aviutlRoot, onAviutlRootChange, onPickExistingDir, t],
  );
  const portableOptions = useMemo(
    () => ({
      portable,
      standardLabel: t('details.standard'),
      portableActiveClassName: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500',
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
          <div className={action.spinnerWhite} /> {t('common:status.processing')}
        </span>
      ),
      idleContent: t('common:actions.next'),
    }),
    [canProceed, onBack, onNext, savingInstallDetails, t],
  );

  return <DetailsSectionBase header={header} input={input} portable={portableOptions} actions={actions} />;
}
