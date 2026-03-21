interface ChatHeaderProps {
  title?: string;
  model?: string;
}

export function ChatHeader({ title = 'New chat', model = 'gpt-4o-mini' }: ChatHeaderProps) {
  return (
    <div
      className="flex h-14 flex-shrink-0 items-center gap-3 border-b px-5"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex-1 truncate text-[15px] font-semibold">{title}</div>
      <div
        className="rounded-md border px-2.5 py-1 text-[11px] font-semibold"
        style={{ background: 'var(--muted)', color: '#94A3B8', borderColor: 'var(--border)' }}
      >
        {model}
      </div>
    </div>
  );
}
