/**
 * Design philosophy for the shell: maintain a consistent editorial frame so every page feels part of the same crafted dining narrative.
 */
import { Outlet } from 'react-router-dom';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { brandSurfaces } from '@/styles/brand';

export function AppShell() {
  return (
    <div className={`min-h-screen ${brandSurfaces.shell} text-[#26170f]`}>
      <div className="grain-overlay pointer-events-none fixed inset-0 opacity-50" />
      <SiteHeader />
      <main className="relative z-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
