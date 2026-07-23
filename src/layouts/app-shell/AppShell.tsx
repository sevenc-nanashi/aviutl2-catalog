import { Outlet, useOutletContext } from 'react-router-dom';
import ErrorDialog from '@/components/ErrorDialog';
import AppSidebar from './components/AppSidebar';
import useAppShellState from './hooks/useAppShellState';
import type { HomeContextValue } from './types';
import { cn } from '@/lib/cn';
import { useCatalogDispatch } from '@/utils/catalogStore';
import { useUpdatePrompt } from '@/features/app-update/useUpdatePrompt';
import { useGlobalGuards } from '@/bootstrap/useGlobalGuards';
import { useCatalogBootstrap } from '@/bootstrap/useCatalogBootstrap';
import UpdateDialog from '@/features/app-update/UpdateDialog';
import { useShowMainWindow } from '@/utils/useShowMainWindow';
import { isDesktop } from '@/lib/target';

export default function AppShell() {
  const state = useAppShellState();
  const dispatch = useCatalogDispatch();
  const { updateInfo, updateBusy, updateError, confirmUpdate, dismissUpdate } = useUpdatePrompt({
    autoCheck: isDesktop,
  });

  useGlobalGuards();
  useShowMainWindow();
  useCatalogBootstrap(dispatch);

  return (
    <>
      <UpdateDialog
        open={Boolean(updateInfo)}
        version={updateInfo?.version || ''}
        notes={updateInfo?.notes || ''}
        publishedOn={updateInfo?.publishedOn || ''}
        busy={updateBusy}
        error={updateError}
        onConfirm={confirmUpdate}
        onCancel={dismissUpdate}
      />
      <div className="flex h-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 overflow-hidden">
        <AppSidebar
          isSidebarCollapsed={state.isSidebarCollapsed}
          activePage={state.activePage}
          updateAvailableCount={state.updateAvailableCount}
          actionHandlers={state.sidebarActionHandlers}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
          <div
            className={cn(
              'flex-1',
              state.activePage === 'home'
                ? 'overflow-hidden px-0 pt-0 pb-0'
                : 'overflow-y-auto scroll-smooth px-6 [scrollbar-gutter:stable]',
              state.activePage === 'register' ? 'pt-0 pb-0' : state.activePage === 'home' ? '' : 'pt-6 pb-6',
            )}
            ref={state.activePage === 'home' ? undefined : state.scrollContainerRef}
          >
            <Outlet context={state.outletContext} />
          </div>
        </main>

        <ErrorDialog open={Boolean(state.error)} message={state.error} onClose={() => state.setError('')} />
      </div>
    </>
  );
}

export function useHomeContext(): HomeContextValue {
  return useOutletContext<HomeContextValue>();
}
