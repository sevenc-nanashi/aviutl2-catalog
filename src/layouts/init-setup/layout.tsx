import { useShowMainWindow } from '@/utils/useShowMainWindow';
import { Outlet } from 'react-router';

export default function Layout() {
  useShowMainWindow();

  return (
    <>
      <Outlet />
    </>
  );
}
