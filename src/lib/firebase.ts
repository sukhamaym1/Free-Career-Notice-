import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let db = null;

try {
  if (firebaseConfig && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    console.warn("Firebase configuration is missing or incomplete.");
  }
} catch (e) {
  console.error("Failed to initialize Firebase", e);
}

export { db };
