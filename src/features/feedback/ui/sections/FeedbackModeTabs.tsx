import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Bug, MessageSquare } from 'lucide-react';
import type { FeedbackModeTabsProps } from '../types';

export default function FeedbackModeTabs({ mode, onModeChange }: FeedbackModeTabsProps) {
  const { t } = useTranslation('feedback');
  return (
    <div className="m-4 flex w-fit gap-1 rounded-lg border border-slate-200/50 bg-slate-50 p-1 dark:border-slate-800/50 dark:bg-slate-900/50">
      <Button
        type="button"
        onClick={() => onModeChange('bug')}
        variant={mode === 'bug' ? 'tabActive' : 'tab'}
        size="tab"
        className="cursor-pointer rounded-md"
      >
        <Bug size={16} />
        {t('modes.bug')}
      </Button>
      <Button
        type="button"
        onClick={() => onModeChange('inquiry')}
        variant={mode === 'inquiry' ? 'tabActive' : 'tab'}
        size="tab"
        className="cursor-pointer rounded-md"
      >
        <MessageSquare size={16} />
        {t('modes.inquiry')}
      </Button>
    </div>
  );
}
