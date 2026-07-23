import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { HomeSearchBarProps } from '../../types';

export default function HomeSearchBar({ searchQuery, onSearchQueryChange }: HomeSearchBarProps) {
  const { t } = useTranslation('home');

  return (
    <div className="relative min-w-[8rem] max-w-2xl flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        className="w-full rounded-lg border border-slate-200/80 bg-white/95 py-2 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
      />
      {searchQuery ? (
        <button
          onClick={() => onSearchQueryChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          type="button"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
