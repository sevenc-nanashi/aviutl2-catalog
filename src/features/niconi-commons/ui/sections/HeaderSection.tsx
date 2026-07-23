import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { HeaderSectionProps } from '../types';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { layout, page, text } from '@/components/ui/_styles';

export default function HeaderSection({ copyState, selectedCount, onCopySelected }: HeaderSectionProps) {
  const { t } = useTranslation('niconiCommons');

  return (
    <div className={page.headerRow}>
      <div>
        <h2 className={cn(text.titleXl, 'mb-1')}>{t('page.title')}</h2>
        <p className={text.mutedSm}>{t('page.description')}</p>
      </div>
      <div className={layout.wrapGap2}>
        <Button
          variant={copyState.ok ? 'success' : 'primary'}
          size="default"
          className={cn('cursor-pointer', copyState.ok && 'bg-emerald-600 hover:bg-emerald-700')}
          onClick={onCopySelected}
          disabled={selectedCount === 0}
          type="button"
        >
          {copyState.ok ? <Check size={16} /> : <Copy size={16} />}
          {copyState.ok ? t('header.copied', { count: copyState.count }) : t('header.copy')}
        </Button>
      </div>
    </div>
  );
}
