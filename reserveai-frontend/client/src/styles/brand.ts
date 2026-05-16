/**
 * Design philosophy for style tokens: preserve the contemporary editorial dining mood through warm mineral surfaces, brass accents and restrained drama.
 */
export const brandSurfaces = {
  shell: 'bg-[radial-gradient(circle_at_top_left,_rgba(196,154,108,0.18),_transparent_24%),linear-gradient(180deg,_#fffdf7_0%,_#f6efe3_54%,_#f3eadc_100%)]',
  panel: 'bg-white/78 backdrop-blur-xl',
  darkPanel: 'bg-[#201814]/82 backdrop-blur-xl text-white',
  spotlight: 'bg-[radial-gradient(circle_at_top,_rgba(185,141,92,0.32),_transparent_36%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(255,248,236,0.82))]'
} as const;

export const brandCopy = {
  title: 'ReserveAí',
  subtitle: 'Reservas para experiências gastronômicas com uma linguagem visual mais calorosa, clara e confiável.'
} as const;
