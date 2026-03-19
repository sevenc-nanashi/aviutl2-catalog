import { Outlet, useOutletContext } from 'react-router-dom';
import ErrorDialog from '@/components/ErrorDialog';
import { SORT_OPTIONS } from './constants';
import AppSidebar from './components/AppSidebar';
import HomeSearchHeader from './components/HomeSearchHeader';
import useAppShellState from './hooks/useAppShellState';
import type { HomeContextValue } from './types';
import { cn } from '@/lib/cn';
import { useCatalogDispatch } from '@/utils/catalogStore';
import { useUpdatePrompt } from '@/features/app-update/useUpdatePrompt';
import { useGlobalGuards } from '@/bootstrap/useGlobalGuards';
import { useCatalogBootstrap } from '@/bootstrap/useCatalogBootstrap';
import UpdateDialog from '@/features/app-update/UpdateDialog';

export { SORT_OPTIONS };

export default function AppShell() {
  const state = useAppShellState();
  const dispatch = useCatalogDispatch();
  const { updateInfo, updateBusy, updateError, confirmUpdate, dismissUpdate } = useUpdatePrompt();

  useGlobalGuards();
  useCatalogBootstrap(dispatch);

  return (
    <>
      <UpdateDialog
        open={!!updateInfo}
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
          {state.isHome ? (
            <HomeSearchHeader searchQuery={state.displaySearchQuery} onSearchQueryChange={state.setSearchQuery} />
          ) : null}

          <div
            ref={state.scrollContainerRef}
            className={cn(
              'flex-1 overflow-y-auto scroll-smooth px-6 [scrollbar-gutter:stable]',
              state.activePage === 'home' ? 'pt-0 pb-6' : state.activePage === 'register' ? 'pt-0 pb-0' : 'pt-6 pb-6',
            )}
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
