import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { layout } from '@/components/ui/_styles';
import { DEPRECATION_STATUS_OPTIONS, INSTALL_STATUS_OPTIONS } from '@/layouts/app-shell/constants';
import { cn } from '@/lib/cn';
import { renderDeprecationStatusIcon, renderInstallStatusIcon } from '../../filterIcons';
import {
  dropdownItemBaseClass,
  dropdownItemSelectedClass,
  dropdownPanelClass,
  neutralControlTextClass,
} from '../../filterStyles';
import type { HomeQuickFiltersRowProps } from '../../types';
import { isDesktop } from '@/lib/target';

export default function HomeQuickFiltersRow({
  installStatus,
  deprecationStatus,
  selectedTags,
  isFilterExpanded,
  isInstallMenuOpen,
  isDeprecationMenuOpen,
  onToggleInstallMenu,
  onCloseInstallMenu,
  onSelectInstallStatus,
  onToggleDeprecationMenu,
  onCloseDeprecationMenu,
  onSelectDeprecationStatus,
  onToggleFilterExpanded,
}: HomeQuickFiltersRowProps) {
  const { t } = useTranslation('home');
  const getInstallStatusLabel = (status: (typeof INSTALL_STATUS_OPTIONS)[number]) =>
    status === 'all' ? t('shared.all') : t(`installStatus.${status}`);
  const getDeprecationStatusLabel = (status: (typeof DEPRECATION_STATUS_OPTIONS)[number]) =>
    status === 'all' ? t('shared.all') : t(`deprecationStatus.${status}`);
  const installButtonLabel = getInstallStatusLabel(installStatus);
  const installButtonVariant =
    installStatus === 'installed' ? 'accentEmerald' : installStatus === 'not_installed' ? 'muted' : 'secondary';
  const installButtonTextClass =
    installStatus === 'installed' ? 'text-emerald-600 dark:text-emerald-300' : neutralControlTextClass;
  const deprecationButtonLabel = getDeprecationStatusLabel(deprecationStatus);
  const deprecationButtonClass =
    deprecationStatus === 'deprecated'
      ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-800/60 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/45'
      : neutralControlTextClass;
  const deprecationButtonTextClass =
    deprecationStatus === 'deprecated' ? 'text-yellow-600 dark:text-yellow-300' : neutralControlTextClass;

  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
      <div
        className={cn(
          layout.inlineGap1_5,
          'shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400',
        )}
      >
        <Filter size={14} className="opacity-70" />
        <span>{t('filters.label')}</span>
      </div>

      {isDesktop ? (
        <div className="relative">
          <Button
            onClick={onToggleInstallMenu}
            variant={installButtonVariant}
            size="actionSm"
            className="cursor-pointer whitespace-nowrap"
            type="button"
          >
            {renderInstallStatusIcon(installStatus, installStatus === 'installed' ? 'accent' : 'neutral')}
            <span className={cn('text-sm font-medium', installButtonTextClass)}>{installButtonLabel}</span>
            <ChevronDown size={14} />
          </Button>
          {isInstallMenuOpen ? (
            <>
              <button
                type="button"
                aria-label={t('filters.closeInstallMenu')}
                className="fixed inset-0 z-10"
                onClick={onCloseInstallMenu}
              />
              <div className={dropdownPanelClass}>
                {INSTALL_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => onSelectInstallStatus(option)}
                    className={cn(
                      dropdownItemBaseClass,
                      installStatus === option ? dropdownItemSelectedClass : neutralControlTextClass,
                    )}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      {renderInstallStatusIcon(option)}
                      <span>{getInstallStatusLabel(option)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="relative">
        <Button
          onClick={onToggleDeprecationMenu}
          variant="secondary"
          size="actionSm"
          className={cn('cursor-pointer whitespace-nowrap', deprecationButtonClass)}
          type="button"
        >
          {renderDeprecationStatusIcon(deprecationStatus, 'accent')}
          <span className={cn('text-sm font-medium', deprecationButtonTextClass)}>{deprecationButtonLabel}</span>
          <ChevronDown size={14} />
        </Button>
        {isDeprecationMenuOpen ? (
          <>
            <button
              type="button"
              aria-label={t('filters.closeDeprecationMenu')}
              className="fixed inset-0 z-10"
              onClick={onCloseDeprecationMenu}
            />
            <div className={dropdownPanelClass}>
              {DEPRECATION_STATUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => onSelectDeprecationStatus(option)}
                  className={cn(
                    dropdownItemBaseClass,
                    deprecationStatus === option ? dropdownItemSelectedClass : neutralControlTextClass,
                  )}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    {renderDeprecationStatusIcon(option)}
                    <span>{getDeprecationStatusLabel(option)}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <Button
        onClick={onToggleFilterExpanded}
        variant={isFilterExpanded || selectedTags.length > 0 ? 'accentBlue' : 'secondary'}
        size="actionSm"
        className={cn('cursor-pointer whitespace-nowrap', neutralControlTextClass)}
        type="button"
      >
        <Filter size={16} className={neutralControlTextClass} />
        <span className={cn('text-sm font-medium', neutralControlTextClass)}>{t('filters.tagFilter')}</span>
        {selectedTags.length > 0 ? (
          <span
            className={cn(
              layout.center,
              'ml-1 h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm',
            )}
          >
            {selectedTags.length}
          </span>
        ) : null}
        {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </Button>
    </div>
  );
}
