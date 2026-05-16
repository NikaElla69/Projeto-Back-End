/**
 * Design philosophy for the header: pair editorial refinement with clear wayfinding, keeping the main actions always within reach.
 */
import { Menu, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navLinkBase = 'text-sm font-medium tracking-[0.08em] text-[#5d4738] transition hover:text-[#1f140d]';

export function SiteHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/55 bg-white/72 px-5 py-3 shadow-[0_18px_50px_rgba(66,42,25,0.08)] backdrop-blur-xl">
        <Link className="flex items-center gap-3 text-[#20140d]" to="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#23150f] font-display text-lg text-[#f4d4a4]">R</div>
          <div>
            <p className="font-display text-xl leading-none">ReserveAí</p>
            <p className="text-xs uppercase tracking-[0.32em] text-[#8b5e34]">Dining editorial</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink className={navLinkBase} to="/">Início</NavLink>
          <NavLink className={navLinkBase} to="/reservations">Minhas reservas</NavLink>
          {isAuthenticated ? null : <NavLink className={navLinkBase} to="/register">Cadastro</NavLink>}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-[#ead9c0] bg-[#f8f0e1] px-4 py-2 text-sm text-[#3b2517]">
                <UserRound className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <button className="btn-secondary" onClick={logout} type="button">Sair</button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">Entrar</Link>
              <Link className="btn-primary" to="/register">Criar conta</Link>
            </>
          )}
        </div>

        <button
          aria-label="Abrir menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9c0] bg-[#f8f0e1] text-[#2b1b13] lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] border border-white/55 bg-white/88 p-4 shadow-[0_18px_50px_rgba(66,42,25,0.08)] backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3">
            <NavLink className={navLinkBase} onClick={() => setIsOpen(false)} to="/">Início</NavLink>
            <NavLink className={navLinkBase} onClick={() => setIsOpen(false)} to="/reservations">Minhas reservas</NavLink>
            {!isAuthenticated && (
              <NavLink className={navLinkBase} onClick={() => setIsOpen(false)} to="/register">Cadastro</NavLink>
            )}
            <div className="mt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <button className="btn-secondary justify-center" onClick={logout} type="button">Sair</button>
              ) : (
                <>
                  <Link className="btn-secondary justify-center" onClick={() => setIsOpen(false)} to="/login">Entrar</Link>
                  <Link className="btn-primary justify-center" onClick={() => setIsOpen(false)} to="/register">Criar conta</Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
