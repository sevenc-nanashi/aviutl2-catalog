import { useTranslation } from 'react-i18next';
import { INQUIRY_FIELDS } from '../../model/fieldNames';
import FeedbackVisibilityBadge from '../components/FeedbackVisibilityBadge';
import FeedbackAttachmentSection from './FeedbackAttachmentSection';
import FeedbackBasicFieldsSection from './FeedbackBasicFieldsSection';
import type { InquiryFormSectionProps } from '../types';
import { layout, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function InquiryFormSection({
  inquiry,
  attachments,
  onInquiryChange,
  onFilesChange,
  onRemoveAttachment,
}: InquiryFormSectionProps) {
  const { t } = useTranslation('feedback');
  return (
    <>
      <div
        className={cn(
          surface.infoBox,
          'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300',
        )}
      >
        <div className={layout.headerInlineStrong}>
          <FeedbackVisibilityBadge type="private" />
          <span>{t('visibility.privateTitle')}</span>
        </div>
        <div className={text.mutedXsRelaxedFaded}>{t('visibility.privateDescription')}</div>
      </div>

      <FeedbackBasicFieldsSection
        idPrefix="inq"
        names={INQUIRY_FIELDS}
        values={inquiry}
        onChange={onInquiryChange}
        titlePlaceholder={t('fields.inquiryTitlePlaceholder')}
        detailPlaceholder={t('fields.inquiryDetailPlaceholder')}
        contactPlaceholder={t('fields.inquiryContactPlaceholder')}
      />

      <div className={surface.sectionTopBorder}>
        <FeedbackAttachmentSection
          attachments={attachments}
          onFilesChange={onFilesChange}
          onRemoveAttachment={onRemoveAttachment}
          label={t('attachments.label')}
          optionalLabel={t('shared.optional')}
        />
      </div>
    </>
  );
}
