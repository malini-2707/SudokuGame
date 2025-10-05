import admin from 'firebase-admin';

let initialized = false;

export function initFirebaseAdmin() {
  if (initialized) return admin;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[firebase-admin] Missing env, Firebase Admin not initialized');
    return null;
  }
  // If provided as escaped string with \n, fix it
  if (privateKey.includes('\\n')) privateKey = privateKey.replace(/\\n/g, '\n');
  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    initialized = true;
  } catch (e) {
    if (!/already exists/i.test(e.message)) throw e;
    initialized = true;
  }
  return admin;
}

export async function verifyFirebaseIdToken(idToken) {
  const a = initFirebaseAdmin();
  if (!a) throw new Error('Firebase Admin not configured');
  return a.auth().verifyIdToken(idToken);
}
