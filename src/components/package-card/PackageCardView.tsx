import { checkIsDirectDownloadSupported } from '@/utils/isDirectDownloadSupported';
import { webDownloadPackage } from '@/utils/webDownload';
import PackageCardActionSection from './sections/PackageCardActionSection';
import PackageCardMetaSection from './sections/PackageCardMetaSection';
import PackageCardThumbnailSection from './sections/PackageCardThumbnailSection';
import type { PackageCardViewProps } from './types';
import { cn } from '@/lib/cn';
import { isWeb } from '@/lib/target';

const EMPTY_TAGS: string[] = [];

export default function PackageCardView({
  item,
  thumbnail,
  category,
  lastUpdated,
  isInstalled,
  hasUpdate,
  isPauseStateLoaded,
  isUpdatePaused,
  canInstall,
  busyAction,
  isBusy,
  progress,
  onOpenDetail,
  onDownload,
  onUpdate,
  onRemove,
}: PackageCardViewProps) {
  const tags = Array.isArray(item.tags) ? item.tags : EMPTY_TAGS;
  const isDirectDownloadSupported = checkIsDirectDownloadSupported(item);
  const onWebDownload = isWeb ? async () => { await webDownloadPackage(item); } : undefined;

  return (
    <article
      className={cn(
        'group relative flex flex-row min-w-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-black/40 hover:border-blue-300/50 dark:hover:border-slate-600 transition-all duration-300 ease-out hover:-translate-y-0.5',
        'h-52',
      )}
    >
      <button
        type="button"
        aria-label={`${item.name} の詳細を開く`}
        className="absolute inset-0 z-0 rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        onClick={onOpenDetail}
      />
      <div className="pointer-events-none flex-1 p-4 flex flex-col min-w-0 relative z-10">
        <PackageCardMetaSection item={item} lastUpdated={lastUpdated} tags={tags} />
        <PackageCardActionSection
          isInstalled={isInstalled}
          hasUpdate={hasUpdate}
          isPauseStateLoaded={isPauseStateLoaded}
          isUpdatePaused={isUpdatePaused}
          isDirectDownloadSupported={isDirectDownloadSupported}
          homepage={item.repoURL}
          canInstall={canInstall}
          busyAction={busyAction}
          isBusy={isBusy}
          progress={progress}
          installedVersion={item.installedVersion}
          onDownload={onDownload}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onOpenDetail={onOpenDetail}
          onWebDownload={onWebDownload}
        />
      </div>

      <div className="pointer-events-none relative z-10">
        <PackageCardThumbnailSection thumbnail={thumbnail} itemName={item.name} category={category} />
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-blue-500/20 dark:group-hover:ring-blue-400/20 pointer-events-none transition-all"></div>
    </article>
  );
}
