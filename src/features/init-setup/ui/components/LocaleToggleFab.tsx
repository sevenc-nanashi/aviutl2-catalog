import { Check, ChevronsUpDown, Languages } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentUiLocale, getUiLocaleLabel, UI_LOCALE_OPTIONS, type SupportedUiLocale } from '@/i18n';
import { cn } from '@/lib/cn';

interface LocaleToggleFabProps {
  busy?: boolean;
  onSelectLocale: (locale: SupportedUiLocale) => void;
}

export default function LocaleToggleFab({ busy = false, onSelectLocale }: LocaleToggleFabProps) {
  const { t, i18n } = useTranslation(['settings', 'common']);
  const currentLocale = getCurrentUiLocale(i18n);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const title = t('settings:app.language.label');

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && event.target instanceof Node && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="absolute bottom-6 right-6 z-20">
      {open ? (
        <div className="absolute bottom-full right-0 mb-2 min-w-[184px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-500">
            {title}
          </div>
          <div className="space-y-1 p-1.5">
            {UI_LOCALE_OPTIONS.map((option) => {
              const selected = option.value === currentLocale;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={busy || selected}
                  onClick={() => {
                    setOpen(false);
                    if (!selected) onSelectLocale(option.value);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-default disabled:opacity-70',
                    selected
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-100',
                  )}
                >
                  <span className="min-w-0 flex-1 font-medium">{option.label}</span>
                  {selected ? <Check size={16} className="shrink-0 text-blue-600 dark:text-blue-400" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={busy}
        title={title}
        aria-label={title}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-wait disabled:opacity-70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        )}
      >
        <Languages size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
        <span>{getUiLocaleLabel(currentLocale)}</span>
        <ChevronsUpDown size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
      </button>
    </div>
  );
}
