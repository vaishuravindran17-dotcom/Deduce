// ─── Firebase Config ──────────────────────────────────────────────────────────
// Add your Firebase project credentials in .env.local:
//   NEXT_PUBLIC_FIREBASE_API_KEY=...
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
//   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
//   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
//   NEXT_PUBLIC_FIREBASE_APP_ID=...

export const isFirebaseConfigured =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Lazy-load Firebase only when configured and in a browser environment
let _app: import('firebase/app').FirebaseApp | null = null;
let _auth: import('firebase/auth').Auth | null = null;
let _db: import('firebase/firestore').Firestore | null = null;

async function getFirebaseModules() {
  if (!isFirebaseConfigured || typeof window === 'undefined') return null;

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');

  if (!_app) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    };
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  }

  return { app: _app, auth: _auth!, db: _db! };
}

export { getFirebaseModules };
export { _auth as auth, _db as db };
