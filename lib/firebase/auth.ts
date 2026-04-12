import { isFirebaseConfigured, getFirebaseModules } from './config';
import type { DeduceUser } from '@/types';

export function mapFirebaseUser(
  user: import('firebase/auth').User | null,
): DeduceUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    isGuest: user.isAnonymous,
  };
}

export async function signInWithGoogle(): Promise<DeduceUser> {
  if (!isFirebaseConfigured) throw new Error('Firebase not configured');
  const modules = await getFirebaseModules();
  if (!modules) throw new Error('Firebase not configured');

  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(modules.auth, provider);
  return mapFirebaseUser(result.user)!;
}

export async function signInAsGuest(): Promise<DeduceUser> {
  if (!isFirebaseConfigured || typeof window === 'undefined') {
    // Offline guest mode — no Firebase needed
    return {
      uid: `guest-${Date.now()}`,
      displayName: 'Detective',
      email: null,
      photoURL: null,
      isGuest: true,
    };
  }

  const modules = await getFirebaseModules();
  if (!modules) {
    return {
      uid: `guest-${Date.now()}`,
      displayName: 'Detective',
      email: null,
      photoURL: null,
      isGuest: true,
    };
  }

  const { signInAnonymously } = await import('firebase/auth');
  const result = await signInAnonymously(modules.auth);
  return mapFirebaseUser(result.user)!;
}

export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured) return;
  const modules = await getFirebaseModules();
  if (!modules) return;
  const { signOut: fbSignOut } = await import('firebase/auth');
  await fbSignOut(modules.auth);
}

export function onAuthChange(
  callback: (user: DeduceUser | null) => void,
): () => void {
  if (!isFirebaseConfigured || typeof window === 'undefined') return () => {};

  // Async setup
  let unsubscribe: (() => void) | null = null;
  let cancelled = false;

  getFirebaseModules().then((modules) => {
    if (cancelled || !modules) return;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(modules.auth, (user) =>
        callback(mapFirebaseUser(user)),
      );
    });
  });

  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}
