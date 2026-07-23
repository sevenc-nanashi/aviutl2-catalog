import type { CSSProperties } from 'react';
import { Copy, Minus, Square, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TitleBarControlsProps {
  max: boolean;
  onMinimize: () => Promise<void>;
  onToggleMaximize: () => Promise<void>;
  onClose: () => Promise<void>;
  noDragStyle: CSSProperties;
  labels: {
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
  };
}

export default function TitleBarControls({
  max,
  onMinimize,
  onToggleMaximize,
  onClose,
  noDragStyle,
  labels,
}: TitleBarControlsProps) {
  const baseBtn = 'h-8 w-12 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors';
  const controlBtn = 'hover:bg-slate-200 dark:hover:bg-slate-800 active:bg-slate-300 dark:active:bg-slate-700';

  return (
    <div className="flex items-stretch" data-tauri-drag-region="false" data-no-drag="true" style={noDragStyle}>
      <button
        className={cn(baseBtn, controlBtn)}
        onClick={() => void onMinimize()}
        title={labels.minimize}
        aria-label={labels.minimize}
        type="button"
        style={noDragStyle}
      >
        <Minus size={15} />
      </button>
      <button
        className={cn(baseBtn, controlBtn)}
        onClick={() => void onToggleMaximize()}
        onDoubleClick={() => void onToggleMaximize()}
        title={max ? labels.restore : labels.maximize}
        aria-label={max ? labels.restore : labels.maximize}
        type="button"
        style={noDragStyle}
      >
        {max ? <Copy size={13} className="scale-x-[-1]" /> : <Square size={13} />}
      </button>
      <button
        className={cn(baseBtn, 'hover:bg-red-600 hover:text-white active:bg-red-700')}
        onClick={() => void onClose()}
        title={labels.close}
        aria-label={labels.close}
        type="button"
        style={noDragStyle}
      >
        <X size={15} />
      </button>
    </div>
  );
}
