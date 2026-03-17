import type { MouseEvent } from 'react';
import {
  CheckCircle2,
  CirclePause,
  CircleQuestionMark,
  Download,
  ExternalLink,
  RefreshCw,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import ProgressCircle from '../../ProgressCircle';
import type { PackageCardActionHandler, PackageCardBusyAction, PackageCardProgressView } from '../types';
import { layout, surface } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';
import { isWeb } from '@/lib/target';

interface PackageCardActionSectionProps {
  isInstalled: boolean;
  hasUpdate: boolean;
  isPauseStateLoaded: boolean;
  isUpdatePaused: boolean;
  isDirectDownloadSupported: boolean;
  homepage: string | null;
  canInstall: boolean;
  busyAction: PackageCardBusyAction;
  isBusy: boolean;
  progress: PackageCardProgressView;
  installedVersion?: string;
  onDownload: PackageCardActionHandler;
  onUpdate: PackageCardActionHandler;
  onRemove: PackageCardActionHandler;
  onOpenDetail: () => void;
  onWebDownload?: PackageCardActionHandler;
}

const actionButtonBaseClass = 'text-xs font-bold rounded-lg';
const removeButtonClass =
  'h-9 w-9 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed';
const statusBadgeBaseClass = 'h-9 flex-1 gap-1 cursor-default';
const installedActionClass = 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400';
const pausedActionClass =
  'border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';

function handleActionClick(action: PackageCardActionHandler) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void action();
  };
}

interface PrimaryActionButtonProps {
  busy: boolean;
  disabled: boolean;
  progress: PackageCardProgressView;
  label: string;
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  progressClassName?: string;
  className: string;
  onAction: PackageCardActionHandler;
}

function PrimaryActionButton({
  busy,
  disabled,
  progress,
  label,
  title,
  icon: Icon,
  iconClassName,
  progressClassName,
  className,
  onAction,
}: PrimaryActionButtonProps) {
  return (
    <button
      className={cn(layout.center, actionButtonBaseClass, busy && 'relative', className)}
      onClick={handleActionClick(onAction)}
      disabled={disabled}
      title={busy ? progress.label : title}
      type="button"
    >
      {busy ? (
        <>
          <ProgressCircle
            value={progress.ratio}
            size={16}
            strokeWidth={3}
            className={cn('absolute left-5 top-1/2 -translate-y-1/2 shrink-0', progressClassName)}
          />
          <span className="min-w-0 truncate translate-x-3">{progress.label}</span>
        </>
      ) : (
        <>
          <Icon size={14} strokeWidth={2.5} className={cn('shrink-0', iconClassName)} />
          <span className="min-w-0 truncate">{label}</span>
        </>
      )}
    </button>
  );
}

function StatusBadge({ icon: Icon, label, className }: { icon: LucideIcon; label: string; className?: string }) {
  return (
    <div className={cn(layout.center, actionButtonBaseClass, statusBadgeBaseClass, className)}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}

function InstalledActionBadge() {
  return <StatusBadge icon={CheckCircle2} label="導入済" className={cn(installedActionClass, surface.baseMuted)} />;
}

function PausedUpdateBadge() {
  return <StatusBadge icon={CirclePause} label="停止中" className={pausedActionClass} />;
}

function RemoveActionButton({ disabled, onRemove }: { disabled: boolean; onRemove: PackageCardActionHandler }) {
  return (
    <button
      className={cn(layout.center, removeButtonClass)}
      title="削除"
      onClick={handleActionClick(onRemove)}
      disabled={disabled}
      type="button"
    >
      <Trash2 size={16} />
    </button>
  );
}

export default function PackageCardActionSection({
  isInstalled,
  hasUpdate,
  isPauseStateLoaded,
  isUpdatePaused,
  canInstall,
  isDirectDownloadSupported,
  homepage,
  busyAction,
  isBusy,
  progress,
  installedVersion,
  onDownload,
  onUpdate,
  onRemove,
  onOpenDetail,
  onWebDownload,
}: PackageCardActionSectionProps) {
  const downloading = busyAction === 'download';
  const updating = busyAction === 'update';
  const primaryDisabled = isBusy || !canInstall;
  const updateDisabled = primaryDisabled || !isPauseStateLoaded;

  return (
    <div className="relative z-20 flex items-end justify-between gap-3">
      <div className="flex items-center mb-1">
        {isInstalled ? (
          <div className={cn(layout.inlineGap1_5, 'text-xs font-mono text-slate-500 dark:text-slate-400')}>
            <CheckCircle2 size={14} className={hasUpdate ? 'text-amber-500' : 'text-emerald-500'} />
            <span>{installedVersion}</span>
          </div>
        ) : null}
      </div>

      <div className={cn(layout.inlineGap2, 'pointer-events-auto shrink-0 w-[140px] justify-end')}>
        {isWeb ? (
          isDirectDownloadSupported ? (
            <PrimaryActionButton
              busy={false}
              disabled={false}
              progress={progress}
              label="ダウンロード"
              title="ブラウザでダウンロード"
              icon={Download}
              progressClassName="text-white"
              className="h-9 w-full gap-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              onAction={onWebDownload!}
            />
          ) : homepage ? (
            <PrimaryActionButton
              busy={false}
              disabled={false}
              progress={progress}
              label="ホームページ"
              title="ホームページを開く"
              icon={ExternalLink}
              className="h-9 w-full gap-1.5 px-2 bg-gray-600 hover:bg-gray-500 text-white transition-all shadow-lg shadow gray-600/20 hover:shadow-gray-600/30 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              onAction={async () => {
                window.open(homepage!, '_blank', 'noopener');
              }}
            />
          ) : (
            <PrimaryActionButton
              busy={false}
              disabled={false}
              progress={progress}
              label="詳細"
              title="詳細情報を確認"
              icon={CircleQuestionMark}
              className="h-9 w-full gap-1.5 px-2 bg-gray-600 hover:bg-gray-500 text-white transition-all shadow-lg shadow gray-600/20 hover:shadow-gray-600/30 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              onAction={async () => {
                onOpenDetail();
              }}
            />
          )
        ) : !isInstalled ? (
          <PrimaryActionButton
            busy={downloading}
            disabled={primaryDisabled}
            progress={progress}
            label="インストール"
            title="インストール"
            icon={Download}
            progressClassName="text-white"
            className="h-9 w-full gap-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            onAction={onDownload}
          />
        ) : hasUpdate ? (
          isUpdatePaused ? (
            <PausedUpdateBadge />
          ) : (
            <PrimaryActionButton
              busy={updating}
              disabled={updateDisabled}
              progress={progress}
              label="更新"
              title="更新"
              icon={RefreshCw}
              iconClassName="animate-spin-slow"
              progressClassName="text-amber-600 dark:text-amber-400"
              className={cn(
                busyAction === 'update' ? 'w-full' : 'flex-1',
                'h-9 gap-1.5 px-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer disabled:cursor-not-allowed',
              )}
              onAction={onUpdate}
            />
          )
        ) : (
          <InstalledActionBadge />
        )}
        {isInstalled && !updating ? <RemoveActionButton disabled={isBusy} onRemove={onRemove} /> : null}
      </div>
    </div>
  );
}
