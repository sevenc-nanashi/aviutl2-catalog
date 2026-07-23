import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { surface } from '@/components/ui/_styles';
import type { EmptyStateSectionProps } from '../types';
import { cn } from '@/lib/cn';

export default function EmptyStateSection({ onClearConditions }: EmptyStateSectionProps) {
  const { t } = useTranslation('home');

  return (
    <div className={cn(surface.dashedPlaceholder, 'h-auto min-h-[300px] flex-1 select-none dark:text-slate-600')}>
      <Package size={48} className="mb-4 opacity-50" />
      <p>{t('empty.title')}</p>
      <button
        onClick={onClearConditions}
        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        type="button"
      >
        {t('empty.clear')}
      </button>
    </div>
  );
}
