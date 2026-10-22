import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  doc,
  getDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { FirestoreErrorInfo, OperationType } from './types';

const app = initializeApp(firebaseConfig);

// Suppress noisy internal WebChannel retry errors in iframe/proxy environments
setLogLevel('silent');

function createFirestoreInstance() {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createFirestoreInstance();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const STUDIO_OWNER_EMAIL = 'primenestonlinemart@gmail.com';

export function isStudioAdminUser(user: User | null, userRole?: string | null): boolean {
  if (!user) return false;
  if (user.email?.toLowerCase() === STUDIO_OWNER_EMAIL.toLowerCase() && user.emailVerified) {
    return true;
  }
  if (userRole === 'admin') {
    return true;
  }
  return false;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const rawMessage = error instanceof Error ? error.message : String(error);
  // Gracefully ignore transient offline / unavailable network states
  if (
    rawMessage.includes('unavailable') ||
    rawMessage.includes('client is offline') ||
    rawMessage.includes('Could not reach Cloud Firestore backend')
  ) {
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: rawMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Notice: ', JSON.stringify(errInfo));
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logOutAdmin(): Promise<void> {
  await signOut(auth);
}

// Validate connection to Firestore gracefully
async function testConnection() {
  try {
    await getDoc(doc(db, 'adminSettings', 'global'));
  } catch {
    // Client will automatically operate in offline/cached mode until connected
  }
}

testConnection();
