/**
 * Design philosophy for auth framing: use a magazine-like split composition that feels inviting instead of transactional.
 */
import { Link } from 'react-router-dom';
import { brandCopy } from '@/styles/brand';
import { imagery } from '@/lib/assets';

interface AuthSplitLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  alternateLabel: string;
  alternateHref: string;
  alternateAction: string;
  children: React.ReactNode;
}

export function AuthSplitLayout({
  eyebrow,
  title,
  description,
  alternateLabel,
  alternateHref,
  alternateAction,
  children
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-10rem)] gap-6 lg:grid-cols-[1.15fr_0.95fr]">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-[#2a1b14] px-8 py-10 text-white shadow-[0_28px_90px_rgba(35,18,10,0.34)] sm:px-10 lg:px-14 lg:py-14">
        <img
          src={imagery.abstractBrand}
          alt="Textura artística do ReserveAí"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,12,9,0.62),rgba(79,50,29,0.34))]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f0d1a2]">{brandCopy.title}</p>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
              <h1 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
              <p className="max-w-lg text-base leading-7 text-white/78">{description}</p>
            </div>
          </div>
          <div className="grid gap-4 rounded-[1.6rem] border border-white/15 bg-white/8 p-5 backdrop-blur-md sm:grid-cols-3">
            <div>
              <p className="text-sm text-white/60">Fluxo orientado</p>
              <p className="mt-2 font-display text-2xl">API integrada</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Autenticação</p>
              <p className="mt-2 font-display text-2xl">JWT</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Experiência</p>
              <p className="mt-2 font-display text-2xl">Responsiva</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel flex items-center rounded-[2rem] px-6 py-10 shadow-[0_28px_80px_rgba(72,44,22,0.12)] sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-lg space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34]">{eyebrow}</p>
            <h2 className="font-display text-3xl text-[#26170f] sm:text-4xl">{title}</h2>
            <p className="text-sm leading-7 text-[#6b5647]">{description}</p>
          </div>

          {children}

          <p className="text-sm text-[#6b5647]">
            {alternateLabel}{' '}
            <Link className="font-semibold text-[#8b5e34] transition hover:text-[#59361a]" to={alternateHref}>
              {alternateAction}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
