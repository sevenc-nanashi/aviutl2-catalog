/**
 * カタログ JSON の部分上書き入力ダイアログ
 */
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { FileBraces } from 'lucide-react';
import { layout, overlay, state, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

interface RegisterJsonImportDialogProps {
  open: boolean;
  value: string;
  error: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
}

export default function RegisterJsonImportDialog({
  open,
  value,
  error,
  onChange,
  onClose,
  onApply,
}: RegisterJsonImportDialogProps) {
  const { t } = useTranslation(['register', 'common']);
  const templateJsonUrl = 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/template.json';
  if (!open) return null;

  return (
    <div className={layout.fixedCenterBlur} role="dialog" aria-modal="true">
      <button type="button" aria-label={t('common:actions.close')} className={overlay.backdrop} onClick={onClose} />
      <div className={cn(surface.modal, 'relative w-full max-w-3xl')}>
        <div className={surface.modalHeaderMuted}>
          <h3 className={cn(layout.inlineGap2, text.titleLg)}>
            <FileBraces size={18} />
            {t('jsonImport.title')}
          </h3>
        </div>
        <div className="space-y-3 px-6 py-5">
          <p className={text.bodySmMutedAlt}>
            <a
              href={templateJsonUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-blue-600 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-700 dark:text-blue-400 dark:decoration-blue-500 dark:hover:text-blue-300"
            >
              template.json
            </a>{' '}
            {t('jsonImport.description')}
          </p>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={t('jsonImport.placeholder')}
            className={cn(
              state.focusRing,
              'h-80 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs leading-5 text-slate-800 shadow-inner dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100',
            )}
          />
          {error && (
            <Alert variant="danger" className="px-3 py-2">
              {error}
            </Alert>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <Button variant="secondary" size="actionSm" type="button" className="border-slate-300" onClick={onClose}>
            {t('jsonImport.cancel')}
          </Button>
          <Button variant="primary" size="actionSm" type="button" className="shadow-sm" onClick={onApply}>
            {t('jsonImport.apply')}
          </Button>
        </div>
      </div>
    </div>
  );
}
