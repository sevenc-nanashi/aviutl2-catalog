import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { packageTypeKeyToTranslationKey, PRIMARY_PACKAGE_TYPES } from '@/utils/query';
import SelectableChipInput from '../components/SelectableChipInput';

interface PackageTypeEditorProps {
  value: string;
  onChange?: (next: string) => void;
}

const PackageTypeEditor = memo(function PackageTypeEditor({ value, onChange }: PackageTypeEditorProps) {
  const { t } = useTranslation(['register', 'common']);
  const normalizedValue = String(value || '').trim();
  const selectedValues = useMemo(() => (normalizedValue ? [normalizedValue] : []), [normalizedValue]);
  const suggestions = useMemo(
    () =>
      PRIMARY_PACKAGE_TYPES.map((entry) =>
        t(`common:packageTypes.${packageTypeKeyToTranslationKey(entry.key)}`, { defaultValue: entry.label }),
      ),
    [t],
  );

  return (
    <SelectableChipInput
      label={t('common:labels.type')}
      inputId="package-type"
      inputName="type"
      values={selectedValues}
      suggestions={suggestions}
      suggestionsLabel={t('packageType.suggestions')}
      onChange={(next) => onChange?.(next[0] || '')}
      inputAriaLabel={t('packageType.inputAria')}
      placeholder={t('packageType.placeholder')}
      helperText={t('packageType.helper')}
      required
      multiple={false}
      commitOnBlur
    />
  );
});

export default PackageTypeEditor;
