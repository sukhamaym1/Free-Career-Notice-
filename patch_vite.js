import fs from 'fs';
let content = fs.readFileSync('vite.config.ts', 'utf8');

const pluginCode = `
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fallbackFirebaseConfig() {
  return {
    name: 'fallback-firebase-config',
    resolveId(id) {
      if (id.endsWith('firebase-applet-config.json')) {
        return id;
      }
    },
    load(id) {
      if (id.endsWith('firebase-applet-config.json')) {
        const resolvedPath = path.resolve(__dirname, 'firebase-applet-config.json');
        if (fs.existsSync(resolvedPath)) {
          return fs.readFileSync(resolvedPath, 'utf-8');
        } else {
          return JSON.stringify({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
            apiKey: process.env.VITE_FIREBASE_API_KEY || '',
            authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
            firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || '',
            storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
            messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
            appId: process.env.VITE_FIREBASE_APP_ID || ''
          });
        }
      }
    }
  };
}
`;

content = content.replace(/function fallbackFirebaseConfig.*?return id;[^\}]*\}\},[^\}]*load.*?\}\n\}\n/s, '');
content = pluginCode + '\n' + content;

fs.writeFileSync('vite.config.ts', content);
