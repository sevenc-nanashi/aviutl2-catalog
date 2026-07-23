import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { BUG_FIELDS } from '../../model/fieldNames';
import FeedbackToggleSwitch from '../components/FeedbackToggleSwitch';
import type { FeedbackLogSectionProps } from '../types';
import { cn } from '@/lib/cn';
import { layout, surface, text } from '@/components/ui/_styles';

export default function FeedbackLogSection({ loading, includeLog, appLog, onBugChange }: FeedbackLogSectionProps) {
  const { t } = useTranslation('feedback');
  return (
    <div className="space-y-3">
      <div className={text.inlineHeadingSm}>
        <FileText size={16} className="text-slate-500" />
        {t('log.title')}
      </div>
      {loading ? (
        <div className={layout.pulseXs}>{t('shared.loading')}</div>
      ) : (
        <div className={cn(surface.panelLgSubtleSoft, 'p-3')}>
          <div className={layout.inlineGap3}>
            <FeedbackToggleSwitch
              id="feedback-include-log"
              name={BUG_FIELDS.includeLog}
              checked={includeLog}
              onChange={onBugChange}
            />
            <label htmlFor="feedback-include-log" className={cn('cursor-pointer', text.labelSm)}>
              {t('log.include')}
            </label>
          </div>
          {includeLog ? (
            <div className="mt-3">
              {appLog ? (
                <pre className="max-h-55 overflow-auto rounded-md bg-slate-100 p-2 font-mono text-[10px] text-slate-600 dark:bg-slate-900 dark:text-slate-400 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 select-text">
                  {appLog}
                </pre>
              ) : (
                <div className="mt-1 text-xs italic text-slate-400">{t('log.unavailable')}</div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
