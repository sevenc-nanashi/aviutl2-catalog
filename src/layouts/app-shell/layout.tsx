import { CatalogProvider, initCatalog } from '@/utils/catalogStore';
import AppShell from './AppShell';

export default function Layout() {
  return (
    <>
      <div className="app-scroll">
        <CatalogProvider init={initCatalog()}>
          <AppShell />
        </CatalogProvider>
      </div>
    </>
  );
}
