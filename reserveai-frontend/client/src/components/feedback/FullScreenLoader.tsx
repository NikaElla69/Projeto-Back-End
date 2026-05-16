/**
 * Design philosophy for loading states: show motion with composure, using quiet editorial cues instead of loud spinners alone.
 */
import { LoaderCircle } from 'lucide-react';

export function FullScreenLoader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="glass-panel max-w-md space-y-4 p-10 text-center shadow-[0_24px_80px_rgba(72,44,22,0.14)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#8b5e34]">
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="font-display text-2xl text-[#26170f]">{title}</p>
          <p className="text-sm leading-6 text-[#6b5647]">{description}</p>
        </div>
      </div>
    </div>
  );
}
