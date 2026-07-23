import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { FeedbackDeleteButtonProps } from '../types';

const FeedbackDeleteButton = memo(function FeedbackDeleteButton({
  onClick,
  ariaLabel,
  title,
}: FeedbackDeleteButtonProps) {
  const { t } = useTranslation('feedback');
  const resolvedLabel = ariaLabel || t('attachments.remove');
  return (
    <Button
      variant="iconSubtle"
      size="icon"
      className="cursor-pointer"
      aria-label={resolvedLabel}
      title={title || resolvedLabel}
      onClick={onClick}
    >
      <Trash2 size={16} />
    </Button>
  );
});

export default FeedbackDeleteButton;
