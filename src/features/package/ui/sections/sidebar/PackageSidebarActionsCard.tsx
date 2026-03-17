import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CheckCircle2, Download, ExternalLink, PackageSearch, RefreshCw, Trash2 } from 'lucide-react';
import ProgressCircle from '@/components/ProgressCircle';
import type { PackageSidebarSectionProps } from '../../types';
import { cn } from '@/lib/cn';
import { layout, surface } from '@/components/ui/_styles';
import { isWeb } from '@/lib/target';
import { checkIsDirectDownloadSupported } from '@/utils/isDirectDownloadSupported';
import { webDownloadPackage } from '@/utils/webDownload';

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
  const downloading = busyAction === 'download';
  const updating = busyAction === 'update';
  const removing = busyAction === 'remove';
  const primaryDisabled = isBusy || !canInstall;
  const isDirectDownloadSupported = checkIsDirectDownloadSupported(item);

  return (
    <div className={cn(surface.cardSection, 'space-y-3')}>
      {isWeb ? (
        <>
          <button
            className={cn(
              layout.center,
              'h-10 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors gap-2 w-full cursor-pointer',
            )}
            onClick={() => window.open(`aviutl2-catalog://package/${item.id}`, '_self')}
            type="button"
          >
            <PackageSearch size={16} /> カタログで開く
          </button>
          {isDirectDownloadSupported ? (
            <button
              className={cn(
                layout.center,
                'h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors gap-2 w-full cursor-pointer',
              )}
              onClick={() => void webDownloadPackage(item)}
              type="button"
            >
              <Download size={16} /> ダウンロード
            </button>
          ) : item.repoURL ? (
            <button
              className={cn(
                layout.center,
                'h-10 px-4 bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold rounded-lg transition-colors gap-2 w-full cursor-pointer',
              )}
              onClick={() => window.open(item.repoURL, '_blank', 'noopener')}
              type="button"
            >
              <ExternalLink size={16} /> ホームページ
            </button>
          ) : null}
        </>
      ) : item.installed ? (
        <>
          {item.isLatest ? (
            <Badge variant="success" shape="pill" size="sm" className={cn(layout.inlineGap2, 'font-bold')}>
              <CheckCircle2 size={14} /> 最新{item.installedVersion ? `（${item.installedVersion}）` : ''}
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
                  <RefreshCw size={18} /> 更新
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
                '削除中…'
              ) : (
                <>
                  <Trash2 size={18} /> 削除
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
              <Download size={18} /> インストール
            </>
          )}
        </Button>
      )}
    </div>
  );
}
