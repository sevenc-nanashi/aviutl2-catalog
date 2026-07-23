import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CheckCircle2, Download, PackageSearch, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProgressCircle from '@/components/ProgressCircle';
import { getInstalledVersionLabel } from '@/utils/detectResult';
import type { PackageSidebarSectionProps } from '../../types';
import { cn } from '@/lib/cn';
import { layout, surface } from '@/components/ui/_styles';
import { isWeb } from '@/lib/target';

type PackageSidebarActionsCardProps = Pick<
  PackageSidebarSectionProps,
  'item' | 'canInstall' | 'busyAction' | 'isBusy' | 'progress' | 'onDownload' | 'onUpdate' | 'onRemove'
>;

export default function PackageSidebarActionsCard({
  item,
  canInstall,
  busyAction,
  isBusy,
  progress,
  onDownload,
  onUpdate,
  onRemove,
}: PackageSidebarActionsCardProps) {
  const { t } = useTranslation('package');
  const downloading = busyAction === 'download';
  const updating = busyAction === 'update';
  const removing = busyAction === 'remove';
  const primaryDisabled = isBusy || !canInstall;
  const installedVersionLabel = getInstalledVersionLabel(
    item.installedVersion,
    item.detectedResult,
    t('sidebar.versionUnknown'),
  );

  return (
    <div className={cn(surface.cardSection, 'space-y-3')}>
      {isWeb ? (
        <>
          <Button
            variant="secondary"
            size="default"
            radius="xl"
            className="w-full cursor-pointer"
            onClick={() => window.open(`aviutl2-catalog://package/${item.id}`, '_self')}
            type="button"
          >
            <PackageSearch size={18} /> {t('actions.openInCatalog')}
          </Button>
          <Button
            variant="primary"
            size="default"
            radius="xl"
            className="w-full cursor-pointer"
            onClick={() => void onDownload()}
            type="button"
          >
            <Download size={18} /> {t('actions.download')}
          </Button>
        </>
      ) : item.installed ? (
        <>
          {item.isLatest ? (
            <Badge variant="success" shape="pill" size="sm" className={cn(layout.inlineGap2, 'font-bold')}>
              <CheckCircle2 size={14} /> {t('actions.latest')}
              {installedVersionLabel ? `（${installedVersionLabel}）` : ''}
            </Badge>
          ) : (
            <button
              className={cn(
                layout.center,
                'h-10 px-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm font-bold rounded-lg transition-colors gap-2 w-full cursor-pointer disabled:cursor-not-allowed',
              )}
              onClick={() => void onUpdate()}
              disabled={primaryDisabled}
              type="button"
            >
              {updating ? (
                <span className={layout.inlineGap2}>
                  <ProgressCircle
                    value={progress.ratio}
                    size={20}
                    strokeWidth={3}
                    className="text-amber-600 dark:text-amber-400"
                    ariaLabel={`${progress.label} ${progress.percent}%`}
                  />
                  {progress.label} {`${progress.percent}%`}
                </span>
              ) : (
                <>
                  <RefreshCw size={18} /> {t('actions.update')}
                </>
              )}
            </button>
          )}
          {!updating ? (
            <Button
              variant="danger"
              size="default"
              radius="xl"
              className="w-full cursor-pointer disabled:cursor-not-allowed"
              onClick={() => void onRemove()}
              disabled={isBusy}
              type="button"
            >
              {removing ? (
                t('actions.removing')
              ) : (
                <>
                  <Trash2 size={18} /> {t('actions.remove')}
                </>
              )}
            </Button>
          ) : null}
        </>
      ) : (
        <Button
          variant="primary"
          size="default"
          radius="xl"
          className="w-full cursor-pointer disabled:cursor-not-allowed"
          onClick={() => void onDownload()}
          disabled={primaryDisabled}
          type="button"
        >
          {downloading ? (
            <span className={layout.inlineGap2}>
              <ProgressCircle
                value={progress.ratio}
                size={20}
                strokeWidth={3}
                ariaLabel={`${progress.label} ${progress.percent}%`}
              />
              {progress.label} {`${progress.percent}%`}
            </span>
          ) : (
            <>
              <Download size={18} /> {t('actions.install')}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
