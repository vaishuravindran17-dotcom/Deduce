'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { ABSTRACT_TYPE_META, ABSTRACT_PUZZLE_TYPES } from '@/types/abstract';

const ACCENT = '#60A5FA';

export default function AbstractHubPage() {
  const router   = useRouter();
  const { user } = useAuthStore();

  if (!user) { router.replace('/auth'); return null; }

  return (
    <div
      className="flex flex-col"
      style={{ background: '#0C0C0F', minHeight: '100dvh', maxWidth: 480, margin: '0 auto' }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="flex items-center shrink-0"
        style={{ padding: '16px 20px', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button
          onClick={() => router.push('/home')}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 34, height: 34, borderRadius: 8,
            background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4l-6 5 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex items-center" style={{ gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
          <span
            className="font-game"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT }}
          >
            Abstract Logic
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-auto" style={{ padding: '20px 20px 40px' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#5A5A6E' }}>
          Choose Puzzle Type
        </p>
        <div className="grid grid-cols-2" style={{ gap: 10 }}>
          {ABSTRACT_PUZZLE_TYPES.map((type, i) => {
            const meta  = ABSTRACT_TYPE_META[type];
            const color = meta.color;
            return (
              <motion.button
                key={type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/abstract/${type}`)}
                className="text-left rounded-2xl transition-colors"
                style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: 16 }}
              >
                <div
                  className="flex items-center justify-center rounded-[10px] mb-2.5"
                  style={{ width: 36, height: 36, background: `${color}18`, fontSize: 18 }}
                >
                  {meta.emoji}
                </div>
                <p
                  className="font-game"
                  style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color }}
                >
                  {meta.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#5A5A6E' }}>{meta.description}</p>
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] rounded-[5px]"
                  style={{ background: `${color}12`, color, padding: '3px 8px', marginTop: 8 }}
                >
                  Time Attack
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
