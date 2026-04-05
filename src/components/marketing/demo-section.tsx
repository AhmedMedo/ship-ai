'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

/* ───────────────────────────────── constants ────────────────────────────── */

const TABS = ['Chat', 'Usage', 'Settings', 'Billing'] as const;
type Tab = (typeof TABS)[number];

const USER_MSG = 'Build a REST API for user auth with JWT tokens';

const AI_INTRO = "Here's a complete Express API with JWT authentication:";

const CODE_LINES = [
  { tokens: [{ text: 'import', color: '#cba6f7' }, { text: ' express ', color: '#cdd6f4' }, { text: 'from', color: '#cba6f7' }, { text: " 'express'", color: '#a6e3a1' }, { text: ';', color: '#cdd6f4' }] },
  { tokens: [{ text: 'import', color: '#cba6f7' }, { text: ' jwt ', color: '#cdd6f4' }, { text: 'from', color: '#cba6f7' }, { text: " 'jsonwebtoken'", color: '#a6e3a1' }, { text: ';', color: '#cdd6f4' }] },
  { tokens: [] },
  { tokens: [{ text: 'const', color: '#cba6f7' }, { text: ' router = ', color: '#cdd6f4' }, { text: 'express', color: '#89b4fa' }, { text: '.', color: '#cdd6f4' }, { text: 'Router', color: '#89b4fa' }, { text: '();', color: '#cdd6f4' }] },
  { tokens: [] },
  { tokens: [{ text: 'router', color: '#cdd6f4' }, { text: '.', color: '#cdd6f4' }, { text: 'post', color: '#89b4fa' }, { text: '(', color: '#cdd6f4' }, { text: "'/login'", color: '#a6e3a1' }, { text: ', ', color: '#cdd6f4' }, { text: 'async', color: '#cba6f7' }, { text: ' (req, res) => {', color: '#cdd6f4' }] },
  { tokens: [{ text: '  const', color: '#cba6f7' }, { text: ' { email, password } = req.body;', color: '#cdd6f4' }] },
  { tokens: [{ text: '  const', color: '#cba6f7' }, { text: ' user = ', color: '#cdd6f4' }, { text: 'await', color: '#cba6f7' }, { text: ' findUser(email);', color: '#cdd6f4' }] },
  { tokens: [{ text: '  const', color: '#cba6f7' }, { text: ' token = ', color: '#cdd6f4' }, { text: 'jwt', color: '#89b4fa' }, { text: '.sign({ id: user.id },', color: '#cdd6f4' }] },
  { tokens: [{ text: '    process.env.', color: '#cdd6f4' }, { text: 'JWT_SECRET', color: '#f9e2af' }, { text: ');', color: '#cdd6f4' }] },
  { tokens: [{ text: '  res.', color: '#cdd6f4' }, { text: 'json', color: '#89b4fa' }, { text: '({ token });', color: '#cdd6f4' }] },
  { tokens: [{ text: '});', color: '#cdd6f4' }] },
];

const USAGE_STATS = [
  { label: 'Today', value: '4,520', max: '100K', pct: 4.5 },
  { label: 'This month', value: '142,800', max: '5M', pct: 2.9 },
  { label: 'Cost today', value: '$0.07', max: '$10.00', pct: 0.7 },
];

const MODEL_BREAKDOWN = [
  { model: 'gpt-4o-mini', pct: 62, color: '#a6e3a1' },
  { model: 'claude-sonnet', pct: 28, color: '#89b4fa' },
  { model: 'gemini-pro', pct: 10, color: '#f9e2af' },
];

/* ────────────────────────── IntersectionObserver hook ─────────────────── */

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ──────────────────────────── typing hook ────────────────────────────── */

function useTypingEffect(text: string, speed: number, startDelay: number, trigger: boolean) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) { setDisplayed(''); setDone(false); return; }
    let i = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    setDisplayed('');
    setDone(false);

    const delayTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(intervalId); setDone(true); }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay, trigger]);

  return { displayed, done };
}

/* ────────────────────────── code streaming hook ─────────────────────── */

function useCodeStream(lines: typeof CODE_LINES, trigger: boolean) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!trigger) { setVisibleLines(0); return; }
    let line = 0;
    const interval = setInterval(() => {
      line++;
      setVisibleLines(line);
      if (line >= lines.length) clearInterval(interval);
    }, 320);
    return () => clearInterval(interval);
  }, [trigger, lines.length]);

  return visibleLines;
}

/* ──────────────────────── animated bar component ────────────────────── */

function AnimatedBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.max(pct, 6)), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-2 rounded-full"
        style={{
          width: `${width}%`,
          background: color,
          transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}

/* ────────────────────── tab cross-fade wrapper ──────────────────────── */

function TabTransition({ tabKey, children }: { tabKey: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [tabKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────── Chat Tab Content ──────────────────────────────── */

function ChatContent() {
  const [phase, setPhase] = useState(0);
  const userTyping = useTypingEffect(USER_MSG, 35, 600, true);
  const aiIntro = useTypingEffect(AI_INTRO, 20, 0, phase >= 1);
  const codeVisible = useCodeStream(CODE_LINES, phase >= 2);

  useEffect(() => {
    if (userTyping.done && phase === 0) {
      const t = setTimeout(() => setPhase(1), 400);
      return () => clearTimeout(t);
    }
  }, [userTyping.done, phase]);

  useEffect(() => {
    if (aiIntro.done && phase === 1) {
      const t = setTimeout(() => setPhase(2), 300);
      return () => clearTimeout(t);
    }
  }, [aiIntro.done, phase]);

  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
      {userTyping.displayed && (
        <div
          className="max-w-[80%] self-end rounded-xl rounded-br-sm px-3.5 py-2 text-[11px] leading-relaxed text-white"
          style={{ background: '#0F4C75' }}
        >
          {userTyping.displayed}
          {!userTyping.done && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse rounded-sm bg-white/70 align-middle" />}
        </div>
      )}

      {phase >= 1 && (
        <div
          className="max-w-[80%] self-start rounded-xl rounded-bl-sm px-3.5 py-2 text-[11px] leading-relaxed"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#F1F5F9' }}
        >
          {aiIntro.displayed}
          {!aiIntro.done && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse rounded-sm bg-cyan-400/80 align-middle" />}
        </div>
      )}

      {phase >= 2 && (
        <div
          className="rounded-lg p-3 text-[10px] leading-[1.7]"
          style={{
            background: '#1e1e2e',
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            color: '#cdd6f4',
          }}
        >
          {CODE_LINES.slice(0, codeVisible).map((line, i) => (
            <div key={i} className="min-h-[1.1em]">
              {line.tokens.map((t, j) => (
                <span key={j} style={{ color: t.color }}>{t.text}</span>
              ))}
            </div>
          ))}
          {codeVisible < CODE_LINES.length && (
            <span
              className="inline-block h-3.5 w-[2px] rounded-sm"
              style={{ background: '#3498DB', animation: 'blink 1s infinite' }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Usage Tab Content ─────────────────────────────── */

function UsageContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="text-[12px] font-semibold" style={{ color: '#F1F5F9' }}>
        Token Usage Dashboard
      </div>

      {USAGE_STATS.map((s, i) => (
        <div key={s.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px]" style={{ color: '#94A3B8' }}>
            <span>{s.label}</span>
            <span>
              <span style={{ color: '#F1F5F9' }}>{s.value}</span> / {s.max}
            </span>
          </div>
          <AnimatedBar pct={s.pct} color="#3498DB" delay={300 + i * 250} />
        </div>
      ))}

      <div className="mt-1 text-[10px] font-medium" style={{ color: '#94A3B8' }}>
        Model breakdown
      </div>
      <div className="flex gap-2">
        {MODEL_BREAKDOWN.map((m, i) => (
          <div
            key={m.model}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-lg p-2"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.04)',
              animation: `fadeSlideUp 0.5s ${0.4 + i * 0.15}s both`,
            }}
          >
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
            <div className="text-[10px] font-semibold" style={{ color: '#F1F5F9' }}>{m.pct}%</div>
            <div className="text-[8px]" style={{ color: '#64748B' }}>{m.model}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Settings Tab Content ──────────────────────────── */

function SettingsContent() {
  const [provider, setProvider] = useState(0);
  const providers = ['OpenAI', 'Anthropic', 'Google'];

  useEffect(() => {
    const t = setTimeout(() => setProvider(1), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden">
      <div className="text-[12px] font-semibold" style={{ color: '#F1F5F9' }}>
        AI Provider Settings
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[10px]" style={{ color: '#94A3B8' }}>Active provider</div>
        <div className="flex gap-2">
          {providers.map((p, i) => (
            <button
              key={p}
              className="rounded-md px-3 py-1.5 text-[10px] font-medium transition-all duration-500"
              style={{
                background: provider === i ? '#0F4C75' : 'rgba(255,255,255,0.04)',
                color: provider === i ? '#fff' : '#94A3B8',
                border: `1px solid ${provider === i ? '#0F4C75' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-2">
        <div className="text-[10px]" style={{ color: '#94A3B8' }}>API Key</div>
        <div
          className="rounded-md px-3 py-2 text-[10px]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#64748B',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          sk-ant-••••••••••••••••
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-2">
        <div className="text-[10px]" style={{ color: '#94A3B8' }}>Model</div>
        <div
          className="rounded-md px-3 py-2 text-[10px]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#F1F5F9',
          }}
        >
          claude-sonnet-4-6
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Billing Tab Content ───────────────────────────── */

function BillingContent() {
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden">
      <div className="text-[12px] font-semibold" style={{ color: '#F1F5F9' }}>
        Subscription & Billing
      </div>

      <div
        className="flex items-center justify-between rounded-lg p-3"
        style={{
          background: 'linear-gradient(135deg, rgba(15,76,117,0.3), rgba(124,58,237,0.15))',
          border: '1px solid rgba(255,255,255,0.06)',
          animation: 'fadeSlideUp 0.5s 0.2s both',
        }}
      >
        <div>
          <div className="text-[11px] font-semibold" style={{ color: '#F1F5F9' }}>Pro Plan</div>
          <div className="text-[9px]" style={{ color: '#94A3B8' }}>Billed monthly • Renews Apr 28</div>
        </div>
        <div className="text-[14px] font-bold" style={{ color: '#a6e3a1' }}>$29<span className="text-[9px] font-normal" style={{ color: '#64748B' }}>/mo</span></div>
      </div>

      <div className="flex gap-2" style={{ animation: 'fadeSlideUp 0.5s 0.4s both' }}>
        <div className="flex-1 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="text-[9px]" style={{ color: '#64748B' }}>This month</div>
          <div className="text-[13px] font-semibold" style={{ color: '#F1F5F9' }}>$29.00</div>
        </div>
        <div className="flex-1 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="text-[9px]" style={{ color: '#64748B' }}>Usage overage</div>
          <div className="text-[13px] font-semibold" style={{ color: '#F1F5F9' }}>$0.00</div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 rounded-md px-3 py-2"
        style={{
          background: 'rgba(166,227,161,0.08)',
          border: '1px solid rgba(166,227,161,0.15)',
          animation: 'fadeSlideUp 0.5s 0.6s both',
        }}
      >
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#a6e3a1' }} />
        <span className="text-[10px]" style={{ color: '#a6e3a1' }}>Payment up to date</span>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN DEMO SECTION ═══════════════════════════ */

export function DemoSection() {
  const { ref: sectionRef, inView } = useInView(0.2);
  const [activeTab, setActiveTab] = useState<Tab>('Chat');
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start auto-play only after the section scrolls into view
  useEffect(() => {
    if (inView) setAutoPlay(true);
  }, [inView]);

  // Auto-cycle through tabs
  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setTimeout(() => {
      setActiveTab((prev) => {
        const idx = TABS.indexOf(prev);
        return TABS[(idx + 1) % TABS.length];
      });
    }, activeTab === 'Chat' ? 9000 : 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeTab, autoPlay]);

  const handleTabClick = useCallback((tab: Tab) => {
    setAutoPlay(false);
    setActiveTab(tab);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAutoPlay(true), 12000);
  }, []);

  const tabIcons: Record<Tab, string> = {
    Chat: '💬',
    Usage: '📊',
    Settings: '⚙️',
    Billing: '💳',
  };

  return (
    <section
      id="demo"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative z-[1] px-6 pb-20 pt-4"
    >
      {/* Section heading */}
      <div className="mx-auto mb-8 max-w-[960px] text-center">
        <span
          className="mb-2 inline-block text-[12px] font-semibold uppercase tracking-widest"
          style={{
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Live Preview
        </span>
        <h2 className="text-[22px] font-bold sm:text-[28px]" style={{ color: '#F1F5F9' }}>
          See it in action
        </h2>
      </div>

      <div
        className="mx-auto max-w-[960px]"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow:
              '0 40px 80px rgba(0,0,0,0.5), 0 0 120px rgba(124,58,237,0.06), 0 0 120px rgba(6,182,212,0.04)',
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
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <div
              className="mx-auto flex items-center gap-1 rounded-md px-3 py-1 text-[11px]"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#6B7280' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              ignitra.dev/dashboard/{activeTab.toLowerCase()}
            </div>
          </div>

          {/* App body */}
          <div className="flex min-h-[320px] gap-0 p-0 sm:gap-4 sm:p-5">
            {/* Sidebar */}
            <div className="hidden w-[170px] flex-shrink-0 sm:block">
              <div
                className="mb-2 flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-bold"
                style={{ color: '#F1F5F9' }}
              >
                <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="10" fill="#0F4C75" />
                  <path d="M13 28L20 10L27 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="10" r="3" fill="#E8593C" />
                </svg>
                Ignitra
              </div>

              {TABS.map((item) => (
                <button
                  key={item}
                  onClick={() => handleTabClick(item)}
                  className="my-0.5 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] transition-all duration-300"
                  style={
                    item === activeTab
                      ? { background: '#0F4C75', color: '#fff' }
                      : { color: '#94A3B8' }
                  }
                >
                  <span className="text-[10px]">{tabIcons[item]}</span>
                  {item}
                </button>
              ))}

              {/* Decorative user pill */}
              <div
                className="mt-8 flex items-center gap-2 rounded-lg px-2.5 py-2"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold"
                  style={{ background: '#0F4C75', color: '#fff' }}
                >
                  A
                </div>
                <div>
                  <div className="text-[9px] font-medium" style={{ color: '#F1F5F9' }}>Ahmed</div>
                  <div className="text-[8px]" style={{ color: '#64748B' }}>Pro Plan</div>
                </div>
              </div>
            </div>

            {/* Mobile tab bar */}
            <div className="flex w-full gap-1 border-b border-white/5 px-3 pt-3 sm:hidden">
              {TABS.map((item) => (
                <button
                  key={item}
                  onClick={() => handleTabClick(item)}
                  className="flex-1 rounded-t-md px-2 py-1.5 text-[10px] transition-all duration-300"
                  style={
                    item === activeTab
                      ? { background: '#0F4C75', color: '#fff' }
                      : { color: '#94A3B8' }
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Main content area with cross-fade */}
            <div className="flex-1 p-4 sm:p-0">
              {inView && (
                <TabTransition tabKey={activeTab}>
                  {activeTab === 'Chat' && <ChatContent key="chat" />}
                  {activeTab === 'Usage' && <UsageContent key="usage" />}
                  {activeTab === 'Settings' && <SettingsContent key="settings" />}
                  {activeTab === 'Billing' && <BillingContent key="billing" />}
                </TabTransition>
              )}
            </div>
          </div>
        </div>

        {/* Auto-play indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: activeTab === tab ? '24px' : '8px',
                background: activeTab === tab ? '#3498DB' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
