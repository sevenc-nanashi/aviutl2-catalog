import { useTranslation } from 'react-i18next';
import { Paperclip } from 'lucide-react';
import { FILE_INPUT_CLASS } from '../constants';
import FeedbackDeleteButton from '../components/FeedbackDeleteButton';
import type { FeedbackAttachmentSectionProps } from '../types';
import { cn } from '@/lib/cn';
import { layout, surface, text } from '@/components/ui/_styles';

export default function FeedbackAttachmentSection({
  attachments,
  onFilesChange,
  onRemoveAttachment,
  label,
  optionalLabel = '',
}: FeedbackAttachmentSectionProps) {
  const { t } = useTranslation('feedback');
  const resolvedLabel = label || t('attachments.label');
  return (
    <div className="space-y-3">
      <div className={text.inlineHeadingSm}>
        <Paperclip size={16} className="text-slate-500" />
        {resolvedLabel}
        {optionalLabel ? <span className={text.optionalMuted}>{optionalLabel}</span> : null}
      </div>
      <div className="space-y-3">
        <input type="file" multiple onChange={onFilesChange} className={FILE_INPUT_CLASS} />
        {attachments.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {attachments.map((attachment, index) => (
              <div
                key={`${attachment.name}-${attachment.size}-${attachment.lastModified}-${index}`}
                className={cn(layout.inlineGap2, surface.panelLgSubtle, 'p-2')}
              >
                <div className="min-w-0 flex-1">
                  <div className={text.truncateLabelXs} title={attachment.name}>
                    {attachment.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{(attachment.size / 1024).toFixed(1)} KB</div>
                </div>
                <FeedbackDeleteButton onClick={() => onRemoveAttachment(index)} ariaLabel={t('attachments.remove')} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
