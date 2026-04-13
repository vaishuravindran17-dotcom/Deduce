'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';

const COLORS: Record<string, string> = {
  linkGrid: '#A78BFA', timeTrace: '#FB923C',
  trueLie:  '#F472B6', codeBreak: '#67E8F9',
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
  const color = COLORS[type] ?? '#67E8F9';
  const icon  = ICONS[type] ?? '◈';

  return (
    <div className="min-h-dvh bg-[#141414] flex flex-col">

      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-5 pb-4 border-b border-[#1E1E1E]">
        <button
          onClick={() => router.push('/home')}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#1E1E1E] text-[#888] hover:text-white transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-black text-white">{meta.label}</h1>
      </header>

      <div className="flex-1 px-4 py-10 flex flex-col items-center gap-8">

        {/* Icon tile */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 22 }}
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl"
          style={{ background: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </motion.div>

        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-2">{meta.label}</h2>
          <p className="text-[#666] text-sm leading-relaxed max-w-[240px]">{meta.description}</p>
        </div>

        {/* Mode cards */}
        <div className="w-full space-y-3">
          <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] text-center mb-3">Choose Mode</p>

          {/* Time Attack — active */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/modes/${type}/time-attack`)}
            className="w-full text-left rounded-2xl bg-[#1E1E1E] p-5 transition-all hover:bg-[#252525]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFD600]/15 flex items-center justify-center text-xl">
                  ⏱
                </div>
                <div>
                  <p className="font-black text-white">Time Attack</p>
                  <p className="text-xs text-[#555] mt-0.5">60 seconds · max puzzles</p>
                </div>
              </div>
              <div
                className="px-2.5 py-1 rounded-xl text-[10px] font-black"
                style={{ background: '#FFD60020', color: '#FFD600' }}
              >
                60s
              </div>
            </div>
            <p className="text-sm text-[#555] mt-3">
              Solve as many as you can before time runs out.
            </p>
          </motion.button>

          {/* Online — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="w-full rounded-2xl bg-[#1A1A1A] p-5 opacity-35"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#444]/20 flex items-center justify-center text-xl">
                  🌐
                </div>
                <div>
                  <p className="font-black text-white">Online Duel</p>
                  <p className="text-xs text-[#555] mt-0.5">Live vs leaderboard</p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-[#252525] text-[10px] font-black text-[#444]">
                Soon
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
