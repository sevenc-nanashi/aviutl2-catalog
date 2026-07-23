import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TagEditorProps } from '../types';
import SelectableChipInput from '../components/SelectableChipInput';

const EMPTY_SUGGESTIONS: string[] = [];

const TagEditor = memo(function TagEditor({ initialTags, suggestions, onChange }: TagEditorProps) {
  const { t } = useTranslation(['register', 'common']);
  const resolvedSuggestions = suggestions ?? EMPTY_SUGGESTIONS;

  return (
    <SelectableChipInput
      label={t('common:labels.tags')}
      inputId="tags-input"
      inputName="tags"
      values={initialTags}
      suggestions={resolvedSuggestions}
      suggestionsLabel={t('tags.suggestions')}
      onChange={onChange}
      inputAriaLabel={t('tags.inputAria')}
      placeholder={t('tags.placeholder')}
      helperText={t('tags.helper')}
    />
  );
});

export default TagEditor;
