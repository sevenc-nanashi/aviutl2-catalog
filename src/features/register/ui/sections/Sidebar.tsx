/**
 * サイドバーのコンポーネント
 */
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus, Search } from 'lucide-react';
import type { RegisterSidebarProps } from '../types';
import DeleteButton from '../components/DeleteButton';
import { layout, surface } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

const sidebarSectionLabelClass = 'text-xs font-bold uppercase tracking-wider text-slate-400';
const unselectedItemClass = 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800';

function formatSavedAt(savedAt: number, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(savedAt));
  } catch {
    return '';
  }
}

export default function RegisterSidebar({
  packageSearch,
  catalogLoadState,
  filteredPackages,
  draftPackages,
  selectedPackageId,
  onPackageSearchChange,
  onSelectPackage,
  onStartNewPackage,
  onOpenDraftPackage,
  onDeleteDraftPackage,
}: RegisterSidebarProps) {
  const { t, i18n } = useTranslation(['register', 'common', 'nav']);
  const hasDraftPackages = draftPackages.length > 0;
  const blockedDraftCount = draftPackages.filter((draft) => !draft.readyForSubmit).length;
  const submitListTestStatus =
    blockedDraftCount > 0 ? t('submitBar.blocked', { count: blockedDraftCount }) : t('sidebar.pendingReady');
  const headerStatusClass =
    blockedDraftCount > 0
      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200'
      : 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-900/40 dark:text-emerald-200';

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start lg:h-[calc(100dvh-32px-3rem)]">
      <div className={cn(surface.card, 'p-4 lg:h-full')}>
        <div className="space-y-3 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-0 lg:overflow-hidden">
          <Button
            variant="primary"
            size="lg"
            type="button"
            className="w-full shadow-md hover:shadow-lg lg:mb-3 lg:shrink-0"
            onClick={onStartNewPackage}
          >
            <Plus size={18} />
            {t('sidebar.newPackage')}
          </Button>
          <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 lg:mb-3 lg:shrink-0">
            <div className={layout.rowBetweenGap2}>
              <div className={sidebarSectionLabelClass}>{t('sidebar.pendingList')}</div>
              {hasDraftPackages && (
                <Badge shape="rounded" size="xxs" className={headerStatusClass}>
                  {submitListTestStatus}
                </Badge>
              )}
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar lg:max-h-none lg:overflow-visible">
              {draftPackages.map((draft) => {
                const isSelected = selectedPackageId === draft.packageId;
                const isTestReady = draft.testStatus === 'ready';
                const testStatusLabel =
                  draft.testStatus === 'not_required'
                    ? t('sidebar.draftStatusNotRequired')
                    : isTestReady
                      ? t('sidebar.draftStatusReady')
                      : t('sidebar.draftStatusPending');
                const testStatusClass =
                  draft.testStatus === 'not_required'
                    ? 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    : isTestReady
                      ? 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-900/40 dark:text-emerald-200'
                      : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200';
                return (
                  <div
                    key={draft.draftId}
                    className={cn(
                      'group flex items-center rounded-lg border px-2 py-1.5 transition',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-500/50 dark:bg-blue-900/20'
                        : unselectedItemClass,
                    )}
                  >
                    <Button
                      variant="plain"
                      size="none"
                      type="button"
                      className="min-w-0 flex-1 flex-col items-start justify-start gap-0 text-left"
                      onClick={() => onOpenDraftPackage(draft.draftId)}
                    >
                      <div
                        className={cn(
                          'w-full min-w-0 truncate text-sm font-semibold',
                          isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200',
                        )}
                        title={draft.packageName || draft.packageId}
                      >
                        {draft.packageName || draft.packageId}
                      </div>
                      <div className={cn(layout.inlineGap1_5, 'w-full min-w-0')}>
                        <div className="min-w-0 flex-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {formatSavedAt(draft.savedAt, i18n.language)}
                        </div>
                        <Badge shape="rounded" size="xxs" className={cn('shrink-0', testStatusClass)}>
                          {testStatusLabel}
                        </Badge>
                      </div>
                    </Button>
                    <DeleteButton
                      ariaLabel={t('sidebar.deleteDraftAria', { id: draft.packageId })}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteDraftPackage(draft.draftId);
                      }}
                    />
                  </div>
                );
              })}
              {draftPackages.length === 0 && (
                <div className={surface.dashedSoftPlaceholder}>{t('sidebar.noDrafts')}</div>
              )}
            </div>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white pl-3 pr-0 py-3 dark:border-slate-800 dark:bg-slate-900 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            <div className={cn(sidebarSectionLabelClass, 'pr-3')}>{t('nav:navigation.home')}</div>
            <div className="relative pr-3 lg:shrink-0">
              <Search size={16} className={layout.inputIconLeft} />
              <input
                type="search"
                value={packageSearch}
                onChange={(e) => onPackageSearchChange(e.target.value)}
                placeholder={t('sidebar.searchPlaceholder')}
                className="w-full pl-9"
              />
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1 pr-0 custom-scrollbar lg:max-h-none lg:min-h-0 lg:flex-1">
              {catalogLoadState === 'loading' || catalogLoadState === 'idle' ? (
                <div className={cn(layout.center, 'pr-3 py-8 text-sm text-slate-500')}>
                  <span className="spinner mr-2" />
                  {t('common:router.loading')}
                </div>
              ) : (
                filteredPackages.map((item) => {
                  const isSelected = selectedPackageId === item.id;
                  return (
                    <Button
                      variant="plain"
                      size="none"
                      key={item.id}
                      type="button"
                      onClick={() => onSelectPackage(item)}
                      className={cn(
                        'group flex w-full min-w-0 flex-col items-start justify-start gap-0.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm dark:bg-blue-900/20 dark:border-blue-500/50'
                          : unselectedItemClass,
                      )}
                    >
                      <span
                        className={cn(
                          'block w-full truncate font-semibold',
                          isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200',
                        )}
                        title={item.name || item.id}
                      >
                        {item.name || item.id}
                      </span>
                      <span
                        className={cn(
                          'block w-full truncate text-xs',
                          isSelected ? 'text-blue-600/80 dark:text-blue-400/80' : 'text-slate-500 dark:text-slate-400',
                        )}
                        title={item.author || t('sidebar.unknownAuthor')}
                      >
                        {item.author || t('sidebar.unknownAuthor')}
                      </span>
                    </Button>
                  );
                })
              )}
              {catalogLoadState === 'loaded' && filteredPackages.length === 0 && (
                <div className={cn(surface.dashedSoftPlaceholder, 'mr-3 px-4 py-8 text-sm')}>
                  {t('common:labels.noMatches')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
