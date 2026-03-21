interface ChatHeaderProps {
  title?: string;
  model?: string;
}

export function ChatHeader({ title = 'New chat', model = 'gpt-4o-mini' }: ChatHeaderProps) {
  return (
    <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b px-5">
      <div className="flex-1 truncate text-[15px] font-semibold">{title}</div>
      <div className="rounded-md border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
        {model}
      </div>
    </div>
  );
}
