import {
  AlertTriangle,
  ArrowDownToLine,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Circle,
  Crown,
  TrendingUp,
} from 'lucide-react';
import type { FiltersSectionProps } from './types';

export function renderInstallStatusIcon(
  status: FiltersSectionProps['installStatus'],
  tone: 'accent' | 'neutral' = 'neutral',
) {
  if (status === 'installed') {
    return tone === 'accent' ? (
      <CheckCircle2
        size={16}
        className="fill-emerald-600/20 text-emerald-600 dark:fill-emerald-300/20 dark:text-emerald-300"
      />
    ) : (
      <CheckCircle2 size={16} className="fill-slate-600/10 text-slate-600 dark:fill-slate-300/10 dark:text-slate-300" />
    );
  }

  if (status === 'not_installed') {
    return <Circle size={16} className="text-slate-600 dark:text-slate-300" />;
  }

  return <ArrowDownToLine size={16} className="text-slate-600 dark:text-slate-300" />;
}

export function renderDeprecationStatusIcon(
  status: FiltersSectionProps['deprecationStatus'],
  tone: 'accent' | 'neutral' = 'neutral',
) {
  if (status === 'deprecated') {
    return (
      <AlertTriangle
        size={16}
        className={tone === 'accent' ? 'text-yellow-600 dark:text-yellow-300' : 'text-slate-600 dark:text-slate-300'}
      />
    );
  }

  if (status === 'active') {
    return (
      <CheckCircle2
        size={16}
        className={
          tone === 'accent'
            ? 'fill-slate-700/10 text-slate-700 dark:fill-slate-200/10 dark:text-slate-200'
            : 'fill-slate-600/10 text-slate-600 dark:fill-slate-300/10 dark:text-slate-300'
        }
      />
    );
  }

  return (
    <AlertTriangle
      size={16}
      className={
        tone === 'accent'
          ? 'fill-slate-700/10 text-slate-700 dark:fill-slate-200/10 dark:text-slate-200'
          : 'fill-slate-600/10 text-slate-600 dark:fill-slate-300/10 dark:text-slate-300'
      }
    />
  );
}

export function renderSortOrderIcon(status: FiltersSectionProps['sortOrder'], tone: 'accent' | 'neutral' = 'neutral') {
  const className = tone === 'accent' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300';
  if (status === 'popularity_desc') return <Crown size={16} className={className} />;
  if (status === 'trend_desc') return <TrendingUp size={16} className={className} />;
  if (status === 'added_desc') return <CalendarPlus size={16} className={className} />;
  return <CalendarClock size={16} className={className} />;
}
