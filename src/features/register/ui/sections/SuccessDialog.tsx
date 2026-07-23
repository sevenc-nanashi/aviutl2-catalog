/**
 * 送信完了ダイアログコンポーネント
 */
import { useTranslation } from 'react-i18next';
import Button, { buttonVariants } from '@/components/ui/Button';
import { Check, ExternalLink } from 'lucide-react';
import type { RegisterSuccessDialogProps } from '../types';
import { layout, overlay, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function RegisterSuccessDialog({
  dialog,
  primaryText,
  supportText,
  onClose,
}: RegisterSuccessDialogProps) {
  const { t } = useTranslation(['register', 'common']);
  if (!dialog.open) return null;
  return (
    <div className={layout.fixedCenterBlur} role="dialog" aria-modal="true" aria-labelledby="submit-success-title">
      <button type="button" aria-label={t('common:actions.close')} className={overlay.backdrop} onClick={onClose} />
      <div className={cn(surface.modal, layout.modalWidthLg, 'transform transition-all')}>
        <div className={surface.modalHeaderMuted}>
          <h3 id="submit-success-title" className={text.titleLg}>
            {t('common:submit.completeTitle')}
          </h3>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              aria-hidden
            >
              <Check size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{primaryText}</p>
              {supportText && <p className={text.mutedSm}>{supportText}</p>}
            </div>
          </div>
        </div>
        <div className={layout.footerWrapEndMuted}>
          {dialog.url && (
            <a
              className={cn(buttonVariants({ variant: 'secondary', size: 'actionSm' }), 'shadow-sm')}
              href={dialog.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink size={16} />
              {t('common:actions.openPublicPage')}
            </a>
          )}
          <Button variant="primary" size="actionSm" type="button" className="shadow-sm" onClick={onClose}>
            {t('common:actions.close')}
          </Button>
        </div>
      </div>
    </div>
  );
}
