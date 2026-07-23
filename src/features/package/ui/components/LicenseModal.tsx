import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import type { LicenseModalProps } from '../types';
import { cn } from '@/lib/cn';
import { layout, overlay, surface, text } from '@/components/ui/_styles';

export default function LicenseModal({ license, onClose }: LicenseModalProps) {
  const { t } = useTranslation(['package', 'common']);
  if (!license) return null;
  const body = license.body;

  return (
    <div className={layout.fixedCenter} role="dialog" aria-modal="true" aria-labelledby="license-modal-title">
      <button type="button" aria-label={t('common:actions.close')} className={overlay.backdrop} onClick={onClose} />
      <div className={cn(surface.card, 'relative w-full max-w-2xl shadow-xl')}>
        <div className={surface.sectionDivider}>
          <h3 id="license-modal-title" className="text-lg font-bold">
            {t('package:licenseModal.title', { type: license.type || t('package:sidebar.licenseUnknown') })}
          </h3>
        </div>
        <div className="px-6 py-4">
          {body ? (
            <pre className={cn(surface.panelSubtle, text.bodyXsStrong, 'max-h-[60vh] overflow-auto p-4')}>{body}</pre>
          ) : (
            <div className={text.mutedSm}>{t('package:licenseModal.bodyMissing')}</div>
          )}
        </div>
        <div className={layout.footerEnd}>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common:actions.close')}
          </Button>
        </div>
      </div>
    </div>
  );
}
