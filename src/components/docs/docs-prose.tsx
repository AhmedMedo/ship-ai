/**
 * Typography wrapper for documentation pages — dark theme, monospace for code.
 */
export function DocsProse({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        'text-[15px] leading-relaxed text-gray-300',
        '[&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white',
        '[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:first:mt-0',
        '[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-100',
        '[&_p]:my-4 [&_p]:leading-relaxed',
        '[&_a]:text-[#3498DB] [&_a]:underline-offset-2 hover:[&_a]:underline',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-gray-500',
        '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:marker:text-gray-500',
        '[&_li]:pl-1',
        '[&_strong]:font-semibold [&_strong]:text-gray-100',
        '[&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-cyan-400',
        '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#1e1e2e] [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-gray-300 [&_pre]:[font-family:var(--font-jetbrains-mono),ui-monospace,monospace]',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit',
        '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm',
        '[&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-gray-200',
        '[&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2',
        '[&_hr]:my-10 [&_hr]:border-white/10',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
