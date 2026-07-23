import { cn } from '@/lib/cn';
import { state, surface } from '@/components/ui/_styles';

export const neutralControlTextClass = 'text-slate-600 dark:text-slate-300';

export const dropdownPanelClass = cn(
  surface.baseMuted,
  state.enterZoomIn95,
  'absolute right-0 top-full z-20 mt-2 flex w-max flex-col origin-top-right rounded-xl bg-white py-1 shadow-xl duration-100 dark:bg-slate-900',
);

export const dropdownItemBaseClass =
  'w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800';

export const dropdownItemSelectedClass =
  'bg-slate-100 font-bold text-slate-800 dark:bg-slate-800/80 dark:text-slate-100';
