'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const techStack = ['Next.js 15', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS', 'Vercel AI SDK'];

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' as const, delay },
  };
}

export function HeroSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLElement[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!sceneRef.current) return;
    shapesRef.current = Array.from(sceneRef.current.querySelectorAll('[data-depth]')) as HTMLElement[];

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const animate = () => {
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.05;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.05;

      shapesRef.current.forEach((shape) => {
        const depth = parseFloat(shape.dataset.depth || '0');
        const moveX = (currentRef.current.x - 0.5) * depth * 800;
        const moveY = (currentRef.current.y - 0.5) * depth * 800;
        const rotX = (currentRef.current.y - 0.5) * depth * 20;
        const rotY = (currentRef.current.x - 0.5) * depth * 20;
        shape.style.setProperty('--mx', `${moveX}px`);
        shape.style.setProperty('--my', `${moveY}px`);
        shape.style.setProperty('--rx', `${rotX}deg`);
        shape.style.setProperty('--ry', `${rotY}deg`);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    // Generate particles
    const particlesEl = sceneRef.current.querySelector('#particles') as HTMLElement;
    if (particlesEl) {
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 2 + 1;
        p.style.cssText = `
          position:absolute; border-radius:50%; background:rgba(255,255,255,0.3);
          width:${size}px; height:${size}px;
          left:${Math.random() * 100}%; top:${Math.random() * 100}%;
          opacity:${Math.random() * 0.5 + 0.1};
          animation: particle-float ${Math.random() * 20 + 15}s linear ${-(Math.random() * 20)}s infinite;
        `;
        particlesEl.appendChild(p);
      }
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '45%', left: '50%',
          width: 900, height: 900,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(ellipse, rgba(15,76,117,0.15) 0%, rgba(124,58,237,0.08) 30%, transparent 65%)',
          zIndex: 0,
        }}
      />

      {/* 3D scene */}
      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{ perspective: 1200, transformStyle: 'preserve-3d', zIndex: 0 }}
      >
        {/* Main sphere */}
        <div
          data-depth="0.04"
          className="shape-parallax absolute rounded-full"
          style={{
            width: 500, height: 500,
            left: '50%', top: '40%',
            transform: 'translate(-50%,-50%) translate3d(var(--mx,0),var(--my,0),0) rotateX(var(--rx,0)) rotateY(var(--ry,0))',
            background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.5), rgba(15,76,117,0.35) 50%, rgba(6,182,212,0.15) 80%, transparent)',
            boxShadow: 'inset -40px -40px 80px rgba(0,0,0,0.4), inset 20px 20px 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.12), 0 0 300px rgba(6,182,212,0.06)',
            animation: 'float-main 12s ease-in-out infinite',
          }}
        />
        {/* Secondary sphere */}
        <div
          data-depth="0.08"
          className="absolute rounded-full"
          style={{
            width: 200, height: 200,
            right: '10%', top: '25%',
            transform: 'translate3d(var(--mx,0),var(--my,0),0) rotateX(var(--rx,0)) rotateY(var(--ry,0))',
            background: 'radial-gradient(circle at 35% 35%, rgba(6,182,212,0.5), rgba(15,76,117,0.3) 60%, transparent)',
            boxShadow: 'inset -15px -15px 40px rgba(0,0,0,0.3), inset 8px 8px 25px rgba(6,182,212,0.15), 0 0 80px rgba(6,182,212,0.12)',
            animation: 'float-sec 16s ease-in-out infinite',
          }}
        />
        {/* Small accent spheres */}
        <div
          data-depth="0.12"
          className="absolute rounded-full"
          style={{
            width: 80, height: 80,
            left: '12%', top: '30%',
            transform: 'translate3d(var(--mx,0),var(--my,0),0)',
            background: 'radial-gradient(circle at 30% 30%, rgba(232,89,60,0.7), rgba(252,222,90,0.3) 60%, transparent)',
            boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.3), 0 0 50px rgba(232,89,60,0.15)',
            animation: 'float-sm 10s ease-in-out infinite',
          }}
        />
        <div
          data-depth="0.06"
          className="absolute rounded-full"
          style={{
            width: 60, height: 60,
            left: '18%', bottom: '25%',
            transform: 'translate3d(var(--mx,0),var(--my,0),0)',
            background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.6), rgba(52,152,219,0.3) 70%, transparent)',
            boxShadow: 'inset -6px -6px 15px rgba(0,0,0,0.3), 0 0 40px rgba(124,58,237,0.1)',
            animation: 'float-sm 14s ease-in-out infinite 3s',
          }}
        />
        <div
          data-depth="0.10"
          className="absolute rounded-full"
          style={{
            width: 40, height: 40,
            right: '18%', bottom: '30%',
            transform: 'translate3d(var(--mx,0),var(--my,0),0)',
            background: 'radial-gradient(circle at 30% 30%, rgba(6,182,212,0.6), transparent 70%)',
            boxShadow: '0 0 30px rgba(6,182,212,0.12)',
            animation: 'float-sm 11s ease-in-out infinite 5s',
          }}
        />
        {/* Ring */}
        <div
          data-depth="0.05"
          className="absolute hidden rounded-full md:block"
          style={{
            width: 300, height: 300,
            right: '8%', top: '40%',
            transform: 'translateY(-50%) translate3d(var(--mx,0),var(--my,0),0)',
            border: '2px solid rgba(124,58,237,0.08)',
            boxShadow: '0 0 40px rgba(124,58,237,0.03), inset 0 0 40px rgba(124,58,237,0.02)',
            animation: 'ring-rotate 30s linear infinite',
          }}
        />
        {/* Ribbon */}
        <div
          className="absolute hidden md:block"
          style={{
            left: '5%', bottom: '35%',
            width: 250, height: 50,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.06))',
            borderRadius: 30,
            transform: 'rotate(-15deg) skewX(-10deg)',
            filter: 'blur(1px)',
            animation: 'ribbon-float 18s ease-in-out infinite',
            boxShadow: '0 0 60px rgba(124,58,237,0.03)',
          }}
        />
        {/* Particles container */}
        <div id="particles" className="absolute inset-0" />
      </div>

      {/* Hero content */}
      <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-6 pb-10 pt-20 text-center">
        <motion.div
          {...fadeUpProps(0)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium"
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
            color: '#94A3B8',
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: '#06B6D4', animation: 'pulse-dot 2s ease-in-out infinite' }}
          />
          Built for developers who ship fast
        </motion.div>

        <motion.h1
          {...fadeUpProps(0.1)}
          className="mx-auto mb-7 max-w-[900px] font-black"
          style={{
            fontSize: 'clamp(48px, 7vw, 82px)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: '#F1F5F9',
          }}
        >
          Launch your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3498DB, #06B6D4 50%, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI SaaS
          </span>
          <br />
          in days, not months
        </motion.h1>

        <motion.p
          {...fadeUpProps(0.2)}
          className="mx-auto mb-10 max-w-[580px] text-[18px] leading-[1.7]"
          style={{ color: '#94A3B8' }}
        >
          The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing. Clone. Customize. Deploy.
        </motion.p>

        <motion.div
          {...fadeUpProps(0.3)}
          className="flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <Link
            href="/signup"
            className="rounded-xl px-9 py-4 text-[16px] font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #0F4C75, #3498DB)',
              boxShadow: '0 0 50px rgba(15,76,117,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 80px rgba(15,76,117,0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(15,76,117,0.3)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            Get Ignitra — $249
          </Link>
          <Link
            href="/dashboard/chat"
            className="rounded-xl px-9 py-4 text-[16px] font-bold transition-all"
            style={{
              background: 'transparent',
              color: '#F1F5F9',
              border: '1.5px solid rgba(255,255,255,0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Live demo
          </Link>
        </motion.div>
      </div>

      {/* Tech bar */}
      <motion.div
        {...fadeUpProps(0.5)}
        className="relative z-[2] w-full pb-10 pt-10 text-center"
      >
        <p
          className="mb-5 text-[12px] font-semibold uppercase tracking-[2px]"
          style={{ color: '#4B5563' }}
        >
          Built with technologies you know
        </p>
        <div className="flex flex-wrap justify-center gap-10" style={{ opacity: 0.35 }}>
          {techStack.map((tech) => (
            <span key={tech} className="text-[14px] font-bold" style={{ color: '#94A3B8' }}>
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes float-main {
          0%,100% { transform: translate(-50%,-50%) translate3d(var(--mx,0),var(--my,0),0) rotate3d(1,.5,0,0deg); }
          25% { transform: translate(-48%,-53%) translate3d(var(--mx,0),var(--my,0),0) rotate3d(1,.5,.2,8deg); }
          50% { transform: translate(-52%,-47%) translate3d(var(--mx,0),var(--my,0),0) rotate3d(.5,1,0,-5deg); }
          75% { transform: translate(-49%,-51%) translate3d(var(--mx,0),var(--my,0),0) rotate3d(1,.3,.5,6deg); }
        }
        @keyframes float-sec {
          0%,100% { transform: translate3d(var(--mx,0),var(--my,0),0); }
          33% { transform: translate3d(calc(var(--mx,0) + 20px), calc(var(--my,0) - 30px), 0) rotate3d(.5,1,0,15deg); }
          66% { transform: translate3d(calc(var(--mx,0) - 15px), calc(var(--my,0) + 20px), 0) rotate3d(1,0,.5,-10deg); }
        }
        @keyframes float-sm {
          0%,100% { transform: translate3d(var(--mx,0),var(--my,0),0); }
          33% { transform: translate3d(calc(var(--mx,0) + 15px), calc(var(--my,0) - 20px), 0); }
          66% { transform: translate3d(calc(var(--mx,0) - 10px), calc(var(--my,0) + 15px), 0); }
        }
        @keyframes ring-rotate {
          from { transform: translateY(-50%) translate3d(var(--mx,0),var(--my,0),0) rotate3d(1,.5,.3,0deg); }
          to { transform: translateY(-50%) translate3d(var(--mx,0),var(--my,0),0) rotate3d(1,.5,.3,360deg); }
        }
        @keyframes ribbon-float {
          0%,100% { transform: rotate(-15deg) skewX(-10deg) translateY(0); }
          50% { transform: rotate(-12deg) skewX(-8deg) translateY(-20px); }
        }
        @keyframes particle-float {
          from { transform: translateY(100vh); }
          to { transform: translateY(-10vh); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
