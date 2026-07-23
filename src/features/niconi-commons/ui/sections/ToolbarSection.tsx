import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ToolbarSectionProps } from '../types';
import { layout, page, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function ToolbarSection({ visibleCount, selectedCount, query, onQueryChange }: ToolbarSectionProps) {
  const { t } = useTranslation('niconiCommons');

  return (
    <div className={page.toolbarRow}>
      <div className={cn(text.mutedSm, layout.wrapItemsGap2)}>
        <span>{t('toolbar.visible', { count: visibleCount })}</span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span>{t('toolbar.selected', { count: selectedCount })}</span>
      </div>
      <div className="relative w-full sm:w-72">
        <Search className={layout.inputIconLeft} size={16} />
        <input
          type="search"
          placeholder={t('toolbar.searchPlaceholder')}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
