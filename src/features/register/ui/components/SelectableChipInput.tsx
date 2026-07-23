import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Check, X } from 'lucide-react';
import { normalizeArrayText } from '../../model/helpers';
import { cn } from '@/lib/cn';
import { layout, surface, text } from '@/components/ui/_styles';

interface SelectableChipInputProps {
  label: string;
  inputId: string;
  inputName: string;
  values: string[];
  suggestions?: string[];
  suggestionsLabel?: string;
  onChange?: (next: string[]) => void;
  inputAriaLabel?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  commitOnBlur?: boolean;
  helperText?: string;
}

function areSameValues(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

const SelectableChipInput = memo(function SelectableChipInput({
  label,
  inputId,
  inputName,
  values,
  suggestions = [],
  suggestionsLabel,
  onChange,
  inputAriaLabel,
  placeholder,
  required = false,
  multiple = true,
  commitOnBlur = false,
  helperText,
}: SelectableChipInputProps) {
  const { t } = useTranslation('register');
  const [selectedValues, setSelectedValues] = useState(() => normalizeArrayText(values));
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const normalized = normalizeArrayText(values);
    setSelectedValues(normalized);
    setInputValue('');
  }, [values]);

  const emitChange = useCallback(
    (next: string[]) => {
      const normalized = normalizeArrayText(next);
      setSelectedValues(normalized);
      onChange?.(normalized);
    },
    [onChange],
  );

  const handleAddFromInput = useCallback(
    (rawText: string) => {
      const parts = String(rawText || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      if (!parts.length) {
        setInputValue('');
        return;
      }

      const next = multiple
        ? [...selectedValues, ...parts.filter((value) => !selectedValues.includes(value))]
        : [parts[0]];

      if (!areSameValues(selectedValues, next)) {
        emitChange(next);
      }
      setInputValue('');
    },
    [emitChange, multiple, selectedValues],
  );

  const handleToggleSuggestion = useCallback(
    (value: string) => {
      if (multiple) {
        const next = selectedValues.includes(value)
          ? selectedValues.filter((entry) => entry !== value)
          : [...selectedValues, value];
        emitChange(next);
        return;
      }

      const next = selectedValues[0] === value ? [] : [value];
      emitChange(next);
      setInputValue('');
    },
    [emitChange, multiple, selectedValues],
  );

  const handleRemoveValue = useCallback(
    (value: string) => {
      emitChange(selectedValues.filter((entry) => entry !== value));
    },
    [emitChange, selectedValues],
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      handleAddFromInput(inputValue);
    },
    [handleAddFromInput, inputValue],
  );

  const handleInputBlur = useCallback(() => {
    if (!commitOnBlur || !inputValue.trim()) return;
    handleAddFromInput(inputValue);
  }, [commitOnBlur, handleAddFromInput, inputValue]);

  return (
    <div className="space-y-2">
      <label className={text.labelSm} htmlFor={inputId}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {helperText ? <p className={text.mutedXs}>{helperText}</p> : null}
      <div
        className={cn(
          surface.panelLg,
          'flex min-h-[42px] flex-wrap items-center gap-2 p-1.5 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500',
        )}
      >
        {selectedValues.map((value) => (
          <span
            key={value}
            className={cn(
              layout.inlineGap1,
              'animate-in fade-in zoom-in duration-200 rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600/80',
            )}
          >
            <span className="max-w-[160px] truncate">{value}</span>
            <Button
              variant="plain"
              size="iconXs"
              radius="full"
              type="button"
              className="ml-0.5 cursor-pointer text-slate-400 transition-colors hover:bg-slate-300/70 hover:text-slate-700 dark:hover:bg-slate-500/70 dark:hover:text-slate-100"
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveValue(value);
              }}
              aria-label={t('actions.removeValue', { value })}
            >
              <X size={12} />
            </Button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          name={inputName}
          className="min-w-[120px] flex-1 rounded-md border-0 bg-white p-1 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:bg-slate-800 dark:text-slate-100"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          aria-label={inputAriaLabel || t('actions.inputValue', { label })}
          placeholder={selectedValues.length === 0 ? placeholder : ''}
          required={required && selectedValues.length === 0}
        />
      </div>
      {suggestions.length > 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{suggestionsLabel}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((value) => {
              const isSelected = selectedValues.includes(value);
              return (
                <Button
                  variant="plain"
                  size="none"
                  type="button"
                  key={value}
                  className={cn(
                    layout.inlineGap1,
                    'cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                    isSelected
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/40'
                      : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700/80 dark:hover:text-slate-100',
                  )}
                  onClick={() => handleToggleSuggestion(value)}
                >
                  <span>{value}</span>
                  {isSelected ? <Check size={12} /> : null}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default SelectableChipInput;
