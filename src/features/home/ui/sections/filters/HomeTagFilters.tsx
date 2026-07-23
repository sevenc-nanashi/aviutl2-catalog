import { Tags, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { layout } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';
import type { HomeTagFiltersProps } from '../../types';

export default function HomeTagFilters({
  selectedTags,
  sortedSelectedTags,
  sortedAllTags,
  isFilterExpanded,
  onToggleTag,
  onClearTags,
}: HomeTagFiltersProps) {
  const { t } = useTranslation('home');

  return (
    <>
      {!isFilterExpanded && selectedTags.length > 0 ? (
        <div className={cn(layout.wrapItemsGap2, 'mt-4 animate-in slide-in-from-top-1')}>
          <span className="text-sm font-medium text-slate-400">{t('filters.selected')}</span>
          {sortedSelectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={cn(
                layout.inlineGap1_5,
                'cursor-pointer rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40',
              )}
              type="button"
            >
              {tag}
              <X size={14} />
            </button>
          ))}
          <button
            onClick={onClearTags}
            className="ml-2 cursor-pointer text-sm text-slate-400 underline decoration-slate-300 underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300"
            type="button"
          >
            {t('filters.clearAll')}
          </button>
        </div>
      ) : null}

      {isFilterExpanded ? (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 pt-4 duration-200 dark:border-slate-800">
          <div className={cn(layout.rowBetween, 'mb-3')}>
            <div className={cn(layout.inlineGap1_5, 'text-slate-500 dark:text-slate-400')}>
              <Tags size={14} />
              <span className="text-sm font-bold uppercase tracking-wider">{t('filters.allTags')}</span>
            </div>
            {selectedTags.length > 0 ? (
              <button
                onClick={onClearTags}
                className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600"
                type="button"
              >
                {t('filters.clearSelection')}
              </button>
            ) : null}
          </div>

          <div className="custom-scrollbar flex max-h-[60vh] flex-wrap gap-2 overflow-y-auto pr-2">
            {sortedAllTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                  selectedTags.includes(tag)
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700/50',
                )}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
