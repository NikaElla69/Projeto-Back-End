/**
 * Design philosophy for not-found states: even wrong turns should feel intentional, with a graceful route back into the experience.
 */
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="glass-panel mx-auto max-w-3xl rounded-[2rem] p-8 text-center shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34]">404</p>
        <h1 className="mt-4 font-display text-5xl text-[#26170f]">Esta página saiu do roteiro.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6b5647]">
          Volte para a vitrine principal para continuar explorando restaurantes, entrar com sua conta ou revisar suas reservas.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" to="/">Ir para o início</Link>
          <Link className="btn-secondary" to="/reservations">Ver minhas reservas</Link>
        </div>
      </div>
    </section>
  );
}
