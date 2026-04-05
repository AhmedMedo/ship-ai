'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const gradientStyle = {
  background: 'linear-gradient(135deg, #3498DB, #06B6D4 50%, #7C3AED)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
};

export function RotatingText({ words, interval = 3000, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(intervalRef.current);
  }, [words.length, interval, reduceMotion]);

  if (reduceMotion) {
    return (
      <span className={className} style={gradientStyle}>
        {words[0]}
      </span>
    );
  }

  return (
    /*
     * display:inline-grid — all words are placed in the same grid cell (1/1).
     * The container auto-sizes to the widest word, so no hardcoded minWidth is needed.
     * Short words ("auth") never leave a gap; long phrases ("usage tracking") never overflow.
     */
    <span
      className={className}
      style={{
        display: 'inline-grid',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        lineHeight: 'inherit',
        textAlign: 'center',
      }}
    >
      {/* Invisible sizers — stacked in cell 1/1 so the grid auto-sizes to the widest word */}
      {words.map((word) => (
        <span
          key={`sizer-${word}`}
          aria-hidden
          style={{
            gridArea: '1/1',
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {word}
        </span>
      ))}

      {/* Animated active word — overlaid in the same cell */}
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: '0.3em', filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: '-0.3em', filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{
            ...gradientStyle,
            gridArea: '1/1',
            whiteSpace: 'nowrap',
            display: 'block',
            textAlign: 'center',
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
