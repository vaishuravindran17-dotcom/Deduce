'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';
import { Button } from '@/components/ui/Button';

const COLORS: Record<string, string> = {
  linkGrid: '#818CF8', timeTrace: '#FB923C',
  trueLie:  '#F472B6', codeBreak: '#4ADE80',
};
const ICONS: Record<string, string> = {
  linkGrid: '⊞', timeTrace: '◷', trueLie: '⊡', codeBreak: '◈',
};

export default function PuzzleTypePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const type = params?.type as string;

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user || !PUZZLE_META[type]) { router.replace('/modes'); return null; }

  const meta  = PUZZLE_META[type];
  const color = COLORS[type] ?? '#4ADE80';
  const icon  = ICONS[type] ?? '◈';

  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-safe pt-5 pb-4 border-b border-[#1E1E1E]">
        <button onClick={() => router.push('/home')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#242424] text-[#888] hover:text-[#F0F0F0] transition-all">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-bold text-[#F0F0F0]">{meta.label}</h1>
      </header>

      <div className="flex-1 px-5 py-10 flex flex-col items-center gap-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 280, damping: 20 }}
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl"
          style={{ backgroundColor: `${color}12`, border: `1.5px solid ${color}25`, boxShadow: `0 0 40px ${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </motion.div>

        <div className="text-center">
          <h2 className="text-3xl font-black text-[#F0F0F0] mb-2">{meta.label}</h2>
          <p className="text-[#888] text-sm leading-relaxed max-w-[260px]">{meta.description}</p>
        </div>

        {/* Mode cards */}
        <div className="w-full space-y-3">
          <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] text-center mb-4">Choose Mode</p>

          {/* Time Attack */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/modes/${type}/time-attack`)}
            className="w-full text-left rounded-2xl border border-[#242424] bg-[#161616] p-5 hover:border-[#333] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-xl">⏱</div>
                <div>
                  <p className="font-bold text-[#F0F0F0]">Time Attack</p>
                  <p className="text-xs text-[#555] mt-0.5">60 seconds · max puzzles</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-[#FBBF24] bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2 py-1 rounded-lg">60s</span>
            </div>
            <p className="text-sm text-[#666] ml-13">
              Solve as many as you can before time runs out. Score = count × speed.
            </p>
          </motion.button>

          {/* Online — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="w-full rounded-2xl border border-[#1A1A1A] bg-[#111] p-5 opacity-40"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#555]/10 border border-[#555]/20 flex items-center justify-center text-xl">🌐</div>
                <div>
                  <p className="font-bold text-[#F0F0F0]">Online</p>
                  <p className="text-xs text-[#555] mt-0.5">Leaderboard · global ranking</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-[#555] bg-[#1A1A1A] border border-[#242424] px-2 py-1 rounded-lg">Soon</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
