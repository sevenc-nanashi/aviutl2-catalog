import { ChevronDown, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import type { GuideSectionProps } from '../types';
import { cn } from '@/lib/cn';
import { layout, surface, text } from '@/components/ui/_styles';

export default function GuideSection({ onOpenGuide }: GuideSectionProps) {
  const { t } = useTranslation('niconiCommons');
  const paragraphs = t('guide.body').split('\n');

  return (
    <details
      className={cn(layout.sectionPadSm, 'group mb-4 text-slate-600 dark:text-slate-300', surface.panel, 'shadow-sm')}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-700 dark:text-slate-200">
        <span>{t('guide.title')}</span>
        <ChevronDown size={16} className="text-slate-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p className={text.mutedXs}>{t('guide.note')}</p>
        <Button
          variant="muted"
          size="compact"
          className="rounded-md px-2.5 py-1 text-xs font-medium"
          onClick={onOpenGuide}
          type="button"
        >
          <ExternalLink size={12} />
          {t('guide.open')}
        </Button>
      </div>
    </details>
  );
}
