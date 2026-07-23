import { useTranslation } from 'react-i18next';
import type { ActivePage } from '../types';
import {
  SIDEBAR_SECTIONS,
  resolveSidebarItem,
  type SidebarActionHandlers,
  type SidebarTranslationKey,
} from '../sidebarConfig';
import SidebarButton from './SidebarButton';
import SidebarSectionLabel from './SidebarSectionLabel';
import appIcon from '../../../../src-tauri/icons/icon.svg';
import { layout } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

interface AppSidebarProps {
  isSidebarCollapsed: boolean;
  activePage: ActivePage;
  updateAvailableCount: number;
  actionHandlers: SidebarActionHandlers;
}

export default function AppSidebar({
  isSidebarCollapsed,
  activePage,
  updateAvailableCount,
  actionHandlers,
}: AppSidebarProps) {
  const { t } = useTranslation(['nav', 'common']);
  const translateNav = (key: SidebarTranslationKey) => t(key);

  return (
    <aside
      className={cn(
        'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-30 transition-all duration-300 ease-in-out select-none',
        isSidebarCollapsed ? 'w-20' : 'w-66',
      )}
    >
      <div className="border-b border-slate-100 dark:border-slate-800 h-16 flex items-center shrink-0 overflow-hidden">
        <div className={cn(layout.center, 'w-20 shrink-0')}>
          <img src={appIcon} alt={t('common:appName')} className="h-7 w-7 object-contain" />
        </div>
        {!isSidebarCollapsed ? (
          <div className="flex-1 flex items-center min-w-0 pr-4">
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate tracking-tight">
              {t('common:appName')}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.id} className={cn('p-3', section.className)}>
            <div className="space-y-1">
              {section.label ? (
                <SidebarSectionLabel
                  label={translateNav(section.label)}
                  isCollapsed={isSidebarCollapsed}
                  hideDivider={section.hideDivider}
                  className={section.labelClassName}
                />
              ) : null}

              {section.items.map((item) => {
                const resolvedItem = resolveSidebarItem(item, {
                  activePage,
                  isSidebarCollapsed,
                  updateAvailableCount,
                  t: translateNav,
                });

                return (
                  <SidebarButton
                    key={resolvedItem.id}
                    icon={resolvedItem.icon}
                    label={resolvedItem.label}
                    variant={resolvedItem.variant}
                    isActive={resolvedItem.isActive}
                    isCollapsed={isSidebarCollapsed}
                    onClick={actionHandlers[resolvedItem.id]}
                    badgeCount={resolvedItem.badgeCount}
                    shortcut={resolvedItem.shortcut}
                    rightIcon={resolvedItem.rightIcon}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
