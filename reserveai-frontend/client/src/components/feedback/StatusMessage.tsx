/**
 * Design philosophy for feedback blocks: keep empty, error and helper messages legible, warm and actionable.
 */
import { AlertCircle, Inbox, Sparkles } from 'lucide-react';

interface StatusMessageProps {
  title: string;
  description: string;
  tone?: 'default' | 'error' | 'success';
}

export function StatusMessage({ title, description, tone = 'default' }: StatusMessageProps) {
  const iconMap = {
    default: Inbox,
    error: AlertCircle,
    success: Sparkles
  };

  const Icon = iconMap[tone];
  const toneClass =
    tone === 'error'
      ? 'border-rose-200/80 bg-rose-50/90 text-rose-900'
      : tone === 'success'
        ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-900'
        : 'border-[#eadcc8] bg-white/85 text-[#372416]';

  return (
    <div className={`glass-panel flex items-start gap-4 p-5 ${toneClass}`}>
      <div className="mt-0.5 rounded-full border border-current/10 bg-white/70 p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg">{title}</h3>
        <p className="text-sm leading-6 opacity-80">{description}</p>
      </div>
    </div>
  );
}
