/**
 * 削除ボタンコンポーネント
 */
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { DeleteButtonProps } from '../types';
const DeleteButton = memo(function DeleteButton({ onClick, ariaLabel, title }: DeleteButtonProps) {
  const { t } = useTranslation('common');
  const resolvedLabel = ariaLabel || t('actions.close');
  return (
    <Button
      variant="iconDanger"
      size="icon"
      aria-label={resolvedLabel}
      title={title || resolvedLabel}
      onClick={onClick}
    >
      <Trash2 size={18} />
    </Button>
  );
});

export default DeleteButton;
