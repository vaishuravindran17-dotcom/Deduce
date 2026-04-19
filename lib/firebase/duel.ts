import type { DuelPlayer, Duel, DuelCategory, DuelPuzzleType } from '@/types/duel';

const QUEUE_TIMEOUT_MS = 180_000; // 3 minutes stale threshold
const COUNTDOWN_MS     = 3_500;   // countdown before game starts
const DURATION_S       = 90;
const CODE_CHARS       = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars

async function getDb() {
  const { getFirebaseModules } = await import('@/lib/firebase/config');
  const m = await getFirebaseModules();
  if (!m) throw new Error('Firebase not configured');
  return m.db;
}

function freshPlayer(
  p: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>
): DuelPlayer {
  return { ...p, solved: 0, mistakes: 0, score: 0, finished: false, finishedAt: null };
}

function generateInviteCode(): string {
  return Array.from(
    { length: 6 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join('');
}

function buildDuel(
  type: DuelPuzzleType,
  difficulty: string,
  puzzleCategory: DuelCategory,
  player: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>,
  inviteCode: string | null = null,
): Omit<Duel, 'id'> {
  return {
    type, difficulty, puzzleCategory,
    status: 'waiting',
    duration: DURATION_S,
    createdAt: Date.now(),
    startAt: null,
    winnerId: null,
    isTie: false,
    inviteCode,
    players: { [player.uid]: freshPlayer(player) },
  };
}

// ── Quick Match ───────────────────────────────────────────────────────────────

/**
 * Join the matchmaking queue for a given type+difficulty+category.
 * If someone is already waiting, create a match; otherwise create a new room.
 */
export async function createOrJoinMatchmaking(
  type: DuelPuzzleType,
  difficulty: string,
  player: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>,
  puzzleCategory: DuelCategory,
): Promise<string> {
  const db = await getDb();
  const { runTransaction, doc, collection } = await import('firebase/firestore');

  const queueRef = doc(db, 'matchmaking', `${type}_${difficulty}`);
  let duelId = '';

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(queueRef);
    const data = snap.data();
    const stale = !snap.exists() || Date.now() - (data?.timestamp ?? 0) > QUEUE_TIMEOUT_MS;

    if (stale) {
      const duelRef = doc(collection(db, 'duels'));
      duelId = duelRef.id;
      tx.set(duelRef, buildDuel(type, difficulty, puzzleCategory, player));
      tx.set(queueRef, { uid: player.uid, duelId, timestamp: Date.now() });
    } else if (data!.uid === player.uid) {
      duelId = data!.duelId; // reconnecting
    } else {
      duelId = data!.duelId;
      tx.update(doc(db, 'duels', duelId), {
        status: 'starting',
        startAt: Date.now() + COUNTDOWN_MS,
        [`players.${player.uid}`]: freshPlayer(player),
      });
      tx.delete(queueRef);
    }
  });

  return duelId;
}

/** Remove ourselves from the matchmaking queue and delete the empty room. */
export async function cancelMatchmaking(
  type: DuelPuzzleType,
  difficulty: string,
  uid: string,
): Promise<void> {
  const db = await getDb();
  const { doc, getDoc, deleteDoc } = await import('firebase/firestore');
  const queueRef = doc(db, 'matchmaking', `${type}_${difficulty}`);
  const snap = await getDoc(queueRef);
  if (snap.exists() && snap.data().uid === uid) {
    const { duelId } = snap.data();
    await deleteDoc(queueRef);
    if (duelId) await deleteDoc(doc(db, 'duels', duelId));
  }
}

// ── Private Room ──────────────────────────────────────────────────────────────

/**
 * Create a private room with a shareable invite code.
 * Returns both the duelId (for URL routing) and the 6-char invite code.
 */
export async function createPrivateRoom(
  type: DuelPuzzleType,
  difficulty: string,
  player: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>,
  puzzleCategory: DuelCategory,
): Promise<{ duelId: string; inviteCode: string }> {
  const db = await getDb();
  const { doc, collection, setDoc } = await import('firebase/firestore');

  const inviteCode = generateInviteCode();
  const duelRef    = doc(collection(db, 'duels'));
  const duelId     = duelRef.id;

  await setDoc(duelRef, buildDuel(type, difficulty, puzzleCategory, player, inviteCode));
  // Invite code lookup document
  await setDoc(doc(db, 'inviteCodes', inviteCode), { duelId, createdAt: Date.now() });

  return { duelId, inviteCode };
}

/**
 * Join an existing duel room directly (via shareable link).
 * Throws if the room is already full or not in waiting state.
 */
export async function joinDuelById(
  duelId: string,
  player: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>,
): Promise<void> {
  const db = await getDb();
  const { doc, runTransaction } = await import('firebase/firestore');
  const duelRef = doc(db, 'duels', duelId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(duelRef);
    if (!snap.exists()) throw new Error('Room not found');
    const duel = snap.data() as Omit<Duel, 'id'>;
    if (duel.status !== 'waiting') throw new Error('Room already started');
    if (player.uid in duel.players) return; // already joined, no-op
    tx.update(duelRef, {
      status: 'starting',
      startAt: Date.now() + COUNTDOWN_MS,
      [`players.${player.uid}`]: freshPlayer(player),
    });
  });
}

/**
 * Look up a duel by invite code, then join it.
 * Returns the duelId for navigation.
 */
export async function joinByInviteCode(
  code: string,
  player: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>,
): Promise<string> {
  const db = await getDb();
  const { doc, getDoc } = await import('firebase/firestore');

  const codeSnap = await getDoc(doc(db, 'inviteCodes', code.toUpperCase().trim()));
  if (!codeSnap.exists()) throw new Error('Invalid invite code');

  const { duelId } = codeSnap.data() as { duelId: string };
  const duelSnap   = await getDoc(doc(db, 'duels', duelId));
  if (!duelSnap.exists()) throw new Error('Room not found');

  const duel = duelSnap.data() as Omit<Duel, 'id'>;
  if (duel.players[player.uid]) return duelId; // already in the room

  await joinDuelById(duelId, player);
  return duelId;
}

// ── Shared ────────────────────────────────────────────────────────────────────

/** Subscribe to live duel updates. Returns an unsubscribe function. */
export async function subscribeToDuel(
  duelId: string,
  onUpdate: (duel: Duel) => void,
): Promise<() => void> {
  const db = await getDb();
  const { doc, onSnapshot } = await import('firebase/firestore');
  return onSnapshot(doc(db, 'duels', duelId), (snap) => {
    if (snap.exists()) onUpdate({ id: snap.id, ...snap.data() } as Duel);
  });
}

/** Write intermediate progress so the opponent sees live score updates. */
export async function updateMyProgress(
  duelId: string,
  uid: string,
  solved: number,
  mistakes: number,
  score: number,
): Promise<void> {
  const db = await getDb();
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'duels', duelId), {
    [`players.${uid}.solved`]:   solved,
    [`players.${uid}.mistakes`]: mistakes,
    [`players.${uid}.score`]:    score,
  });
}

/**
 * Mark the current player as finished.
 * If both players are done, atomically determine and write the winner.
 */
export async function finishDuel(
  duelId: string,
  uid: string,
  solved: number,
  mistakes: number,
  score: number,
): Promise<void> {
  const db = await getDb();
  const { doc, runTransaction } = await import('firebase/firestore');
  const duelRef = doc(db, 'duels', duelId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(duelRef);
    if (!snap.exists()) return;

    const duel = snap.data() as Omit<Duel, 'id'>;
    const updatedPlayers: Record<string, DuelPlayer> = {
      ...duel.players,
      [uid]: { ...duel.players[uid], solved, mistakes, score, finished: true, finishedAt: Date.now() },
    };
    const all      = Object.values(updatedPlayers);
    const bothDone = all.length === 2 && all.every(p => p.finished);

    const update: Record<string, unknown> = {
      [`players.${uid}.solved`]:     solved,
      [`players.${uid}.mistakes`]:   mistakes,
      [`players.${uid}.score`]:      score,
      [`players.${uid}.finished`]:   true,
      [`players.${uid}.finishedAt`]: Date.now(),
    };

    if (bothDone) {
      const [p1, p2] = all;
      update.status   = 'finished';
      update.isTie    = p1.score === p2.score;
      update.winnerId = p1.score > p2.score ? p1.uid : p2.score > p1.score ? p2.uid : null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx.update(duelRef, update as any);
  });
}
