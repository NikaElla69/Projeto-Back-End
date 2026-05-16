/**
 * Design philosophy for the footer: close the experience with warmth, guidance and practical reminders for backend integration.
 */
export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-[#e9dccb] bg-[#20140e] px-6 py-8 text-white shadow-[0_24px_80px_rgba(30,18,10,0.22)] sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#f0d1a2]">ReserveAí Front-end</p>
          <h2 className="font-display text-3xl">Uma camada visual pensada para dialogar com a API do seu projeto.</h2>
          <p className="max-w-2xl text-sm leading-7 text-white/72">
            Configure <code className="rounded bg-white/10 px-2 py-1">VITE_API_BASE_URL</code> para apontar para o back-end em execução.
            Quando a API estiver ativa, o fluxo de autenticação, listagem de restaurantes, consulta de mesas e reservas passa a funcionar integralmente.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
            <p className="font-semibold text-white">Portas recomendadas</p>
            <p className="mt-2">Front-end: 5173 via Vite</p>
            <p>Back-end: 3000 com prefixo <code>/api</code></p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
            <p className="font-semibold text-white">Teste sugerido</p>
            <p className="mt-2">Cadastre um usuário, faça login, escolha um restaurante, consulte disponibilidade e conclua uma reserva.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
