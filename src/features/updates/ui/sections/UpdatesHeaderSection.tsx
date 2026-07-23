import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import type { UpdatesHeaderSectionProps } from '../types';
import { page, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function UpdatesHeaderSection({
  bulkUpdating,
  hasAnyItemUpdating,
  updatableCount,
  onBulkUpdate,
}: UpdatesHeaderSectionProps) {
  const { t } = useTranslation('updates');

  return (
    <div className={page.headerRow}>
      <div>
        <h2 className={cn(text.titleXl, 'mb-1')}>{t('page.title')}</h2>
        <p className={text.mutedSm}>{t('page.description')}</p>
      </div>
      <Button
        variant="primary"
        size="lg"
        className="cursor-pointer px-5 py-2.5 shadow-lg"
        onClick={onBulkUpdate}
        disabled={bulkUpdating || hasAnyItemUpdating || updatableCount === 0}
      >
        {t('page.updateAll')}
      </Button>
    </div>
  );
}
