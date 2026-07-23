import { Trans, useTranslation } from 'react-i18next';
import { BUG_FIELDS } from '../../model/fieldNames';
import FeedbackVisibilityBadge from '../components/FeedbackVisibilityBadge';
import FeedbackAttachmentSection from './FeedbackAttachmentSection';
import FeedbackBasicFieldsSection from './FeedbackBasicFieldsSection';
import FeedbackEnvironmentSection from './FeedbackEnvironmentSection';
import FeedbackLogSection from './FeedbackLogSection';
import type { BugReportFormSectionProps } from '../types';
import { layout, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

const publicVisibilityTransComponents = { strong: <strong /> };

export default function BugReportFormSection({
  bug,
  loadingDiag,
  appVersion,
  pluginsCount,
  device,
  appLog,
  attachments,
  onBugChange,
  onFilesChange,
  onRemoveAttachment,
}: BugReportFormSectionProps) {
  const { t } = useTranslation('feedback');
  return (
    <>
      <div
        className={cn(
          surface.infoBox,
          'border-blue-100 bg-blue-50 text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-200',
        )}
      >
        <div className={layout.headerInlineStrong}>
          <FeedbackVisibilityBadge type="public" />
          <span>{t('visibility.publicTitle')}</span>
        </div>
        <div className={text.mutedXsRelaxedFaded}>
          <Trans i18nKey="visibility.publicDescription" ns="feedback" components={publicVisibilityTransComponents} />
        </div>
      </div>

      <FeedbackBasicFieldsSection
        idPrefix="bug"
        names={BUG_FIELDS}
        values={bug}
        onChange={onBugChange}
        titlePlaceholder={t('fields.bugTitlePlaceholder')}
        detailPlaceholder={t('fields.bugDetailPlaceholder')}
        contactPlaceholder={t('fields.bugContactPlaceholder')}
      />

      <div className={surface.sectionTopBorder}>
        <FeedbackAttachmentSection
          attachments={attachments}
          onFilesChange={onFilesChange}
          onRemoveAttachment={onRemoveAttachment}
          label={t('attachments.label')}
        />
        <FeedbackEnvironmentSection
          bug={bug}
          loading={loadingDiag}
          appVersion={appVersion}
          pluginsCount={pluginsCount}
          device={device}
          onBugChange={onBugChange}
        />
        <FeedbackLogSection
          loading={loadingDiag}
          includeLog={bug.includeLog}
          appLog={appLog}
          onBugChange={onBugChange}
        />
      </div>
    </>
  );
}
