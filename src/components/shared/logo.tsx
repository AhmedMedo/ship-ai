import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: 16, gap: 6 },
  md: { icon: 32, text: 20, gap: 8 },
  lg: { icon: 40, text: 26, gap: 10 },
};

export function Logo({ variant = 'full', size = 'md', className }: LogoProps) {
  const s = sizes[size];
  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#0F4C75" />
      <path
        d="M12 28L20 12L28 28"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="12" r="2.5" fill="#3498DB" />
      <line
        x1="14"
        y1="22"
        x2="26"
        y2="22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
  const text = (
    <span
      style={{ fontSize: s.text, fontWeight: 800, letterSpacing: '-0.02em' }}
      className="text-foreground"
    >
      Ship<span className="text-[#0F4C75] dark:text-[#3498DB]">AI</span>
    </span>
  );
  if (variant === 'icon') return <span className={cn('inline-flex', className)}>{icon}</span>;
  if (variant === 'text')
    return <span className={cn('inline-flex items-center', className)}>{text}</span>;
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: s.gap }}>
      {icon}
      {text}
    </span>
  );
}
