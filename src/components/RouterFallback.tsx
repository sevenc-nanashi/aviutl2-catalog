import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { page, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function RouterFallback() {
  const { t } = useTranslation('common');

  return (
    <div className={cn(page.container3xl, page.enterFromBottom)}>
      <section className={cn(surface.panelOverflow, 'p-6')}>
        <h2 className={cn(text.title2xlStrong, 'mb-2')}>{t('router.notFoundTitle')}</h2>
        <p className={cn(text.mutedSm, 'mb-5')}>{t('router.notFoundDescription')}</p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {t('router.goHome')}
        </Link>
      </section>
    </div>
  );
}
