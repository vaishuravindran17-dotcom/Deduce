'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';

const COLORS: Record<string, string> = {
  linkGrid: '#A855F7', timeTrace: '#F97316',
  trueLie:  '#EC4899', codeBreak: '#5CE1E6',
};
const ICONS: Record<string, string> = {
  linkGrid: '⊞', timeTrace: '⊙', trueLie: '⊡', codeBreak: '◈',
};

export default function PuzzleTypePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const type  = params?.type as string;

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user || !PUZZLE_META[type]) { router.replace('/modes'); return null; }

  const meta  = PUZZLE_META[type];
  const color = COLORS[type] ?? '#5CE1E6';
  const icon  = ICONS[type] ?? '◈';

  return (
    <div className="min-h-dvh bg-[#0D0D0D] grid-overlay flex flex-col">

      {/* Header */}
      <header className="border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1E1E1E] text-[#666] hover:text-white transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="font-game text-white text-xl tracking-wider">{meta.label.toUpperCase()}</span>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-5 py-12 flex flex-col items-center gap-10">

        {/* Big icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 280, damping: 22 }}
          className="flex flex-col items-center gap-6"
        >
          <div
            className="w-32 h-32 rounded-3xl flex items-center justify-center"
            style={{ background: `${color}15`, boxShadow: `0 0 60px ${color}20` }}
          >
            <span className="text-7xl" style={{ color }}>{icon}</span>
          </div>
          <div className="text-center">
            <h1 className="font-game text-white mb-2" style={{ fontSize: '52px', letterSpacing: '0.05em' }}>
              {meta.label.toUpperCase()}
            </h1>
            <p className="text-[#555] text-sm leading-relaxed max-w-xs">{meta.description}</p>
          </div>
        </motion.div>

        {/* Mode selection */}
        <div className="w-full space-y-3 max-w-sm">
          <p className="font-game text-[#333] text-center mb-4" style={{ fontSize: '14px', letterSpacing: '0.25em' }}>
            CHOOSE MODE
          </p>

          {/* Time Attack — active */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring' as const, stiffness: 280, damping: 24 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/modes/${type}/time-attack`)}
            className="w-full text-left rounded-2xl bg-[#181818] p-6 transition-all hover:bg-[#1E1E1E] group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: '#FFD60A15' }}
                >
                  ⏱
                </div>
                <div>
                  <p className="font-game text-white text-2xl" style={{ letterSpacing: '0.05em' }}>TIME ATTACK</p>
                  <p className="text-xs text-[#444] mt-0.5">60 seconds · solve as many as possible</p>
                </div>
              </div>
              <span
                className="font-game text-lg px-3 py-1 rounded-xl"
                style={{ background: '#FFD60A20', color: '#FFD60A' }}
              >
                60s
              </span>
            </div>
            <p className="text-sm text-[#444] leading-relaxed">
              Race the clock. Score = puzzles solved × speed bonus.
            </p>
          </motion.button>

          {/* Online — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full rounded-2xl bg-[#141414] p-6 opacity-30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#252525] flex items-center justify-center text-2xl">🌐</div>
                <div>
                  <p className="font-game text-white text-2xl" style={{ letterSpacing: '0.05em' }}>ONLINE DUEL</p>
                  <p className="text-xs text-[#333] mt-0.5">Live vs global leaderboard</p>
                </div>
              </div>
              <span className="font-game text-sm px-3 py-1 rounded-xl bg-[#252525] text-[#333]">SOON</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
