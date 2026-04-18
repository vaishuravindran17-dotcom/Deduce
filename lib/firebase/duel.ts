import type { DuelPlayer, Duel } from '@/types/duel';
import type { AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';

const QUEUE_TIMEOUT_MS = 180_000; // 3 minutes stale threshold
const COUNTDOWN_MS     = 3_500;   // countdown before game starts
const DURATION_S       = 90;

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

/**
 * Join the matchmaking queue for a given type+difficulty.
 * If someone is already waiting, create a match and return the shared duelId.
 * If no one is waiting, create a new duel room and put ourselves in the queue.
 */
export async function createOrJoinMatchmaking(
  type: AbstractPuzzleType,
  difficulty: AbstractDifficulty,
  player: Pick<DuelPlayer, 'uid' | 'displayName' | 'photoURL' | 'isGuest'>
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
      // No one waiting — create a new duel and sit in queue
      const duelRef = doc(collection(db, 'duels'));
      duelId = duelRef.id;
      const duel: Omit<Duel, 'id'> = {
        type, difficulty,
        status: 'waiting',
        duration: DURATION_S,
        createdAt: Date.now(),
        startAt: null,
        winnerId: null,
        isTie: false,
        players: { [player.uid]: freshPlayer(player) },
      };
      tx.set(duelRef, duel);
      tx.set(queueRef, { uid: player.uid, duelId, timestamp: Date.now() });
    } else if (data!.uid === player.uid) {
      // Same player reconnecting (e.g. page refresh)
      duelId = data!.duelId;
    } else {
      // Match found — join the waiting player's duel
      duelId = data!.duelId;
      const duelRef = doc(db, 'duels', duelId);
      tx.update(duelRef, {
        status: 'starting',
        startAt: Date.now() + COUNTDOWN_MS,
        [`players.${player.uid}`]: freshPlayer(player),
      });
      tx.delete(queueRef);
    }
  });

  return duelId;
}

/** Remove ourselves from the matchmaking queue and delete the empty duel room. */
export async function cancelMatchmaking(
  type: AbstractPuzzleType,
  difficulty: AbstractDifficulty,
  uid: string
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

/** Subscribe to live duel updates. Returns an unsubscribe function. */
export async function subscribeToDuel(
  duelId: string,
  onUpdate: (duel: Duel) => void
): Promise<() => void> {
  const db = await getDb();
  const { doc, onSnapshot } = await import('firebase/firestore');
  return onSnapshot(doc(db, 'duels', duelId), (snap) => {
    if (snap.exists()) onUpdate({ id: snap.id, ...snap.data() } as Duel);
  });
}

/** Write intermediate progress to Firestore so the opponent can see live updates. */
export async function updateMyProgress(
  duelId: string,
  uid: string,
  solved: number,
  mistakes: number,
  score: number
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
 * If both players are now finished, atomically determine and write the winner.
 */
export async function finishDuel(
  duelId: string,
  uid: string,
  solved: number,
  mistakes: number,
  score: number
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
      [uid]: {
        ...duel.players[uid],
        solved, mistakes, score,
        finished: true,
        finishedAt: Date.now(),
      },
    };

    const all = Object.values(updatedPlayers);
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
      update.winnerId = p1.score > p2.score ? p1.uid
                      : p2.score > p1.score ? p2.uid
                      : null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx.update(duelRef, update as any);
  });
}
