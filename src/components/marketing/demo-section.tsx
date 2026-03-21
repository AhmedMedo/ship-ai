'use client';

// Product screenshot mockup showing the chat UI — gives buyers a preview

export function DemoSection() {
  return (
    <section className="relative z-[1] px-6 pb-[120px] pt-10">
      <div className="mx-auto max-w-[960px]">
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 120px rgba(124,58,237,0.06), 0 0 120px rgba(6,182,212,0.04)',
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex h-10 items-center gap-2 px-4"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span
              className="flex-1 text-center text-[11px]"
              style={{ color: '#4B5563' }}
            >
              ignitra.dev/dashboard/chat
            </span>
          </div>

          {/* App body */}
          <div className="flex min-h-[280px] gap-4 p-5">
            {/* Sidebar */}
            <div className="w-[180px] flex-shrink-0">
              <div
                className="mb-1.5 flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-bold"
                style={{ color: '#F1F5F9' }}
              >
                <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="10" fill="#0F4C75" />
                  <path d="M13 28L20 10L27 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="10" r="3" fill="#E8593C" />
                </svg>
                Ignitra
              </div>
              {['Chat', 'Usage', 'Settings', 'Billing'].map((item) => (
                <div
                  key={item}
                  className="my-0.5 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px]"
                  style={
                    item === 'Chat'
                      ? { background: '#0F4C75', color: '#fff' }
                      : { color: '#94A3B8' }
                  }
                >
                  <span
                    className="inline-block h-3 w-3 flex-shrink-0 rounded-[3px]"
                    style={{
                      border: '1.5px solid currentColor',
                      opacity: item === 'Chat' ? 1 : 0.4,
                    }}
                  />
                  {item}
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="flex flex-1 flex-col gap-2.5">
              <div
                className="self-end max-w-[75%] rounded-xl rounded-br px-3 py-2 text-[11px] leading-relaxed text-white"
                style={{ background: '#0F4C75', animationDelay: '1.2s' }}
              >
                Build a REST API for user auth
              </div>
              <div
                className="self-start max-w-[75%] rounded-xl rounded-bl px-3 py-2 text-[11px] leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#F1F5F9' }}
              >
                Here&apos;s a complete API with JWT:
              </div>
              <div
                className="rounded-lg p-2.5 text-[10px] leading-relaxed"
                style={{
                  background: '#1e1e2e',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#cdd6f4',
                }}
              >
                <span style={{ color: '#cba6f7' }}>const</span> router ={' '}
                <span style={{ color: '#89b4fa' }}>express</span>.
                <span style={{ color: '#89b4fa' }}>Router</span>();<br />
                router.<span style={{ color: '#89b4fa' }}>post</span>(
                <span style={{ color: '#a6e3a1' }}>&apos;/login&apos;</span>,{' '}
                <span style={{ color: '#cba6f7' }}>async</span> (req, res) =&gt; {'{'}<br />
                &nbsp;&nbsp;<span style={{ color: '#cba6f7' }}>const</span> token ={' '}
                <span style={{ color: '#cba6f7' }}>await</span>{' '}
                <span style={{ color: '#89b4fa' }}>signJWT</span>(user);<br />
                &nbsp;&nbsp;res.<span style={{ color: '#89b4fa' }}>json</span>({'{ token }'});
                <br />
                {'}'});
                <span
                  className="ml-0.5 inline-block h-3 w-0.5 rounded-sm align-middle"
                  style={{ background: '#3498DB', animation: 'blink 1s infinite' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
      `}</style>
    </section>
  );
}
