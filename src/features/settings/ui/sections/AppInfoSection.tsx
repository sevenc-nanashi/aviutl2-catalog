import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AppInfoSectionProps } from '../types';
import { surface, text } from '@/components/ui/_styles';

const infoRowClass = 'flex justify-between items-center text-sm';

export default function AppInfoSection({ appVersion }: AppInfoSectionProps) {
  const { t } = useTranslation('settings');

  return (
    <section className={surface.panelOverflow}>
      <div className={surface.sectionHeader}>
        <Info size={18} className="text-slate-500 dark:text-slate-400" />
        <h3 className={text.headingSmBold}>{t('sections.appInfo')}</h3>
      </div>
      <div className="p-5 space-y-4">
        <div className={infoRowClass}>
          <span className="text-slate-500 dark:text-slate-400">{t('appInfo.version')}</span>
          <span className="font-medium">{appVersion || '-'}</span>
        </div>
        <div className="space-y-2">
          <div className={infoRowClass}>
            <span className="text-slate-500 dark:text-slate-400">{t('appInfo.license')}</span>
            <span className="font-medium">MIT License</span>
          </div>
          <p className={text.mutedXsRelaxed}>{t('appInfo.licenseBody')}</p>
        </div>
      </div>
    </section>
  );
}
