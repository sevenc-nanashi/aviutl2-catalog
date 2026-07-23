/**
 * ライセンス情報入力コンポーネント
 */
import { memo, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Check, ChevronDown, Copy } from 'lucide-react';
import {
  LICENSE_TYPE_OPTIONS,
  buildLicenseBody,
  isOtherRegisterLicenseType,
  isUnknownRegisterLicenseType,
  requiresTemplateCopyrightFields,
} from '@/utils/licenseTemplates';
import { createEmptyLicense } from '../../model/form';
import type { PackageLicenseSectionProps } from '../types';
import ActionDropdown from '../components/ActionDropdown';
import { cn } from '@/lib/cn';
import { grid, layout, surface, text } from '@/components/ui/_styles';

const PackageLicenseSection = memo(
  function PackageLicenseSection({
    license,
    onUpdateLicenseField,
    onToggleTemplate,
    onUpdateCopyright,
  }: PackageLicenseSectionProps) {
    const { t } = useTranslation(['register', 'common']);
    const activeLicense = license || createEmptyLicense();
    const type = activeLicense.type;
    const isOtherType = isOtherRegisterLicenseType(type);
    const isUnknown = isUnknownRegisterLicenseType(type);
    const forceBodyInput = isOtherType;
    const useTemplate = !forceBodyInput && !isUnknown && !activeLicense.isCustom;
    const needsCopyrightInput = useTemplate && requiresTemplateCopyrightFields(type);
    const showBodyInput = forceBodyInput || (!isUnknown && !useTemplate);
    const templatePreview = useTemplate ? buildLicenseBody(activeLicense) : '';
    const licenseTypeSelectOptions = useMemo(
      () => [
        { value: '', label: t('license.selectPlaceholder') },
        ...LICENSE_TYPE_OPTIONS.map((option) => ({
          value: option.value,
          label:
            option.value === 'other'
              ? t('license.typeOptions.other')
              : option.value === 'unknown'
                ? t('license.typeOptions.unknown')
                : option.label,
        })),
      ],
      [t],
    );
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState('');

    useEffect(() => {
      setCopied(false);
      setCopyError('');
    }, [templatePreview, activeLicense.key]);

    async function handleCopyPreview(e: MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      e.stopPropagation();
      if (!templatePreview) return;
      try {
        await navigator.clipboard.writeText(templatePreview);
        setCopyError('');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
        setCopyError(t('license.copyError'));
      }
    }
    return (
      <section className={surface.cardSection}>
        <div className={layout.rowBetweenWrapGap2}>
          <h2 className={text.titleLg}>{t('license.title')}</h2>
        </div>
        <div key={activeLicense.key} className={cn(surface.panel, 'space-y-5 p-5 shadow-sm')}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className={text.labelSm} htmlFor={`license-type-${activeLicense.key}`}>
                {t('common:labels.type')}
                <span className="text-red-500">*</span>
              </label>
              <ActionDropdown
                value={activeLicense.type}
                onChange={(val) => onUpdateLicenseField(activeLicense.key, 'type', val)}
                options={licenseTypeSelectOptions}
                ariaLabel={t('license.typeAria')}
                buttonId={`license-type-${activeLicense.key}`}
              />
            </div>
            {isOtherType && (
              <div className="space-y-2">
                <label className={text.labelSm} htmlFor={`license-name-${activeLicense.key}`}>
                  {t('license.name')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id={`license-name-${activeLicense.key}`}
                  value={activeLicense.licenseName}
                  onChange={(e) => onUpdateLicenseField(activeLicense.key, 'licenseName', e.target.value)}
                  placeholder={t('license.namePlaceholder')}
                  required
                />
                <p className={text.mutedXs}>{t('license.nameHint')}</p>
              </div>
            )}
            {!isUnknown && !isOtherType && (
              <div className="relative flex items-end pb-1">
                <label className={cn(layout.clickableInline, text.labelSm, 'gap-3')}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={useTemplate}
                    onChange={(e) => onToggleTemplate(activeLicense.key, e.target.checked)}
                    disabled={forceBodyInput}
                  />
                  <div className="relative inline-flex h-6 w-11 flex-none items-center rounded-full bg-slate-200 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-checked:bg-blue-600 dark:bg-slate-700">
                    <span
                      className={cn(
                        'absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                        useTemplate && 'translate-x-5',
                      )}
                    />
                  </div>
                  <span>{t('license.useTemplate')}</span>
                </label>
              </div>
            )}
          </div>
          {showBodyInput ? (
            <div className="space-y-2">
              <label className={text.labelSm} htmlFor={`license-body-${activeLicense.key}`}>
                {t('license.body')}
                {forceBodyInput ? <span className="text-red-500">*</span> : ''}
              </label>
              <textarea
                id={`license-body-${activeLicense.key}`}
                className="min-h-[160px] font-mono text-xs leading-relaxed"
                value={activeLicense.licenseBody}
                onChange={(e) => onUpdateLicenseField(activeLicense.key, 'licenseBody', e.target.value)}
                placeholder={t('license.bodyPlaceholder')}
                required={forceBodyInput}
              />
            </div>
          ) : isUnknown ? null : needsCopyrightInput ? (
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
              {t('license.templateHint')}
            </div>
          ) : null}
          {useTemplate && (
            <div className="space-y-4">
              {needsCopyrightInput &&
                activeLicense.copyrights.map((copyright) => (
                  <div key={copyright.key} className={grid.twoCol}>
                    <div className="space-y-2">
                      <label
                        className={text.labelSm}
                        htmlFor={`license-${activeLicense.key}-copyright-years-${copyright.key}`}
                      >
                        {t('license.copyrightYears')}
                      </label>
                      <input
                        id={`license-${activeLicense.key}-copyright-years-${copyright.key}`}
                        value={copyright.years}
                        onChange={(e) => onUpdateCopyright(activeLicense.key, copyright.key, 'years', e.target.value)}
                        placeholder={t('license.copyrightYearsPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className={text.labelSm}
                        htmlFor={`license-${activeLicense.key}-copyright-holder-${copyright.key}`}
                      >
                        {t('license.copyrightHolder')}
                      </label>
                      <input
                        id={`license-${activeLicense.key}-copyright-holder-${copyright.key}`}
                        value={copyright.holder}
                        onChange={(e) => onUpdateCopyright(activeLicense.key, copyright.key, 'holder', e.target.value)}
                        placeholder={t('license.copyrightHolderPlaceholder')}
                      />
                    </div>
                  </div>
                ))}
              <div className={cn(surface.panelSubtle, 'overflow-hidden')}>
                <details className="group">
                  <summary
                    className={cn(
                      layout.sectionPadSm,
                      layout.clickableInline,
                      'justify-between bg-white font-semibold text-slate-700 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
                    )}
                  >
                    <span>{t('common:actions.preview')}</span>
                    <div className={layout.inlineGap2}>
                      {copied && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-right-1">
                          {t('license.copySuccess')}
                        </span>
                      )}
                      {copyError && (
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-right-1">
                          {copyError}
                        </span>
                      )}
                      <Button
                        variant="iconSubtle"
                        size="icon"
                        type="button"
                        className="disabled:opacity-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopyPreview(e);
                        }}
                        disabled={!templatePreview}
                        aria-label={t('license.copy')}
                        title={t('license.copyTitle')}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                      <span className={text.disclosureChevron}>
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  </summary>
                  <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                    {templatePreview ? (
                      <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {templatePreview}
                      </pre>
                    ) : (
                      <p className={text.mutedXs}>{t('license.previewHint')}</p>
                    )}
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  },
  (prev: Readonly<PackageLicenseSectionProps>, next: Readonly<PackageLicenseSectionProps>) =>
    prev.license === next.license &&
    prev.onUpdateLicenseField === next.onUpdateLicenseField &&
    prev.onToggleTemplate === next.onToggleTemplate &&
    prev.onUpdateCopyright === next.onUpdateCopyright,
);

export default PackageLicenseSection;
