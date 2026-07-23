/**
 * 送信バーコンポーネント
 */
import { useTranslation } from 'react-i18next';
import Button, { buttonVariants } from '@/components/ui/Button';
import { BookOpen, FileBraces, Send } from 'lucide-react';
import type { RegisterSubmitBarProps } from '../types';
import { layout, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

const utilityLinkButtonClass = buttonVariants({ variant: 'secondary', size: 'actionSm' });

export default function RegisterSubmitBar({
  packageGuideUrl,
  packageSender,
  submitting,
  pendingSubmitCount,
  blockedSubmitCount,
  submittingLabel,
  onPackageSenderChange,
  onOpenJsonImport,
}: RegisterSubmitBarProps) {
  const { t } = useTranslation(['register', 'common']);
  const hasBlockedDrafts = blockedSubmitCount > 0;
  const canSubmit = pendingSubmitCount > 0 && !hasBlockedDrafts;
  const submitButtonLabel = submitting
    ? submittingLabel || t('submitBar.submitting')
    : hasBlockedDrafts
      ? t('submitBar.blocked', { count: blockedSubmitCount })
      : pendingSubmitCount <= 1
        ? t('common:actions.submit')
        : t('submitBar.submitMany', { count: pendingSubmitCount });

  return (
    <section
      className={cn(surface.card, 'sticky bottom-6 z-20 mb-6 bg-white/80 p-4 backdrop-blur-md dark:bg-slate-900/80')}
    >
      <div className={layout.rowBetweenWrapGap4}>
        <div className={layout.inlineGap2}>
          {packageGuideUrl && (
            <a className={utilityLinkButtonClass} href={packageGuideUrl} target="_blank" rel="noreferrer noopener">
              <BookOpen size={16} />
              {t('submitBar.guide')}
            </a>
          )}
          <Button variant="secondary" size="actionSm" type="button" onClick={onOpenJsonImport}>
            <FileBraces size={16} />
            {t('submitBar.jsonImport')}
          </Button>
        </div>
        <div className={layout.inlineGap3}>
          <div className="hidden sm:flex items-center gap-3">
            <span className={cn(layout.dividerRightMuted, text.mutedXs, 'text-[11px]')}>
              {t('submitBar.authorHint')}
            </span>
            <input
              type="text"
              value={packageSender}
              onChange={(e) => onPackageSenderChange(e.target.value)}
              placeholder={t('common:labels.senderNickname')}
              className="min-w-[200px]"
              aria-label={t('common:labels.senderNickname')}
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="shadow-md hover:shadow-lg"
            disabled={submitting || !canSubmit}
          >
            {submitting ? (
              <>
                <span className="spinner" />
                {submitButtonLabel}
              </>
            ) : (
              <>
                <Send size={18} />
                {submitButtonLabel}
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
