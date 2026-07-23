import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function FeedbackHeaderSection() {
  const { t } = useTranslation('feedback');
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{t('header.title')}</h2>
        <p className={text.mutedSm}>{t('header.description')}</p>
      </div>
      <a
        href="https://github.com/Neosku/aviutl2-catalog/issues"
        target="_blank"
        rel="noreferrer noopener"
        className={cn(buttonVariants({ variant: 'secondary', size: 'actionSm' }), 'cursor-pointer')}
      >
        <ExternalLink size={16} />
        {t('header.issuesLink')}
      </a>
    </div>
  );
}
