import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Textarea from '@/components/ui/Textarea';
import { text } from '@/components/ui/_styles';
import type { FeedbackFieldChangeHandler } from '../types';

interface FeedbackBasicFieldNames {
  title: string;
  detail: string;
  contact: string;
}

interface FeedbackBasicFieldValues {
  title: string;
  detail: string;
  contact: string;
}

interface FeedbackBasicFieldsSectionProps {
  idPrefix: 'bug' | 'inq';
  names: FeedbackBasicFieldNames;
  values: FeedbackBasicFieldValues;
  onChange: FeedbackFieldChangeHandler;
  titlePlaceholder: string;
  detailPlaceholder: string;
  contactPlaceholder: string;
}

export default function FeedbackBasicFieldsSection({
  idPrefix,
  names,
  values,
  onChange,
  titlePlaceholder,
  detailPlaceholder,
  contactPlaceholder,
}: FeedbackBasicFieldsSectionProps) {
  const { t } = useTranslation('feedback');
  return (
    <div className="space-y-4">
      <div>
        <Label spacing="default" htmlFor={`${idPrefix}-title`}>
          {t('fields.title')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${idPrefix}-title`}
          name={names.title}
          value={values.title}
          onChange={onChange}
          required
          placeholder={titlePlaceholder}
        />
      </div>

      <div>
        <Label spacing="default" htmlFor={`${idPrefix}-detail`}>
          {t('fields.detail')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id={`${idPrefix}-detail`}
          name={names.detail}
          value={values.detail}
          onChange={onChange}
          required
          placeholder={detailPlaceholder}
          size="tall"
        />
      </div>

      <div>
        <Label spacing="default" htmlFor={`${idPrefix}-contact`}>
          {t('fields.contact')} <span className={`ml-1 ${text.optionalMuted}`}>{t('shared.optional')}</span>
        </Label>
        <Input
          id={`${idPrefix}-contact`}
          name={names.contact}
          value={values.contact}
          onChange={onChange}
          placeholder={contactPlaceholder}
        />
      </div>
    </div>
  );
}
