import fs from 'fs';

let content = fs.readFileSync('src/lib/github.ts', 'utf-8');

const oldPutFile = `  async putFile(path: string, content: string, message: string, sha?: string) {`;
const newPutFile = `  async putFile(path: string, content: string, message: string, sha?: string) {
    // Also write locally so AI Studio export doesn't delete it
    try {
      await fetch('/api/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path, content })
      });
    } catch (e) {
      console.error('Failed to write locally', e);
    }
`;

const oldPutBinaryFile = `  async putBinaryFile(path: string, base64Content: string, message: string, sha?: string) {`;
const newPutBinaryFile = `  async putBinaryFile(path: string, base64Content: string, message: string, sha?: string) {
    // Also write locally so AI Studio export doesn't delete it
    try {
      await fetch('/api/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path, content: base64Content, encoding: 'base64' })
      });
    } catch (e) {
      console.error('Failed to write locally', e);
    }
`;

const oldDeleteFile = `  async deleteFile(path: string, message: string, sha: string) {`;
const newDeleteFile = `  async deleteFile(path: string, message: string, sha: string) {
    // Also delete locally
    try {
      await fetch('/api/fs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path })
      });
    } catch (e) {
      console.error('Failed to delete locally', e);
    }
`;

content = content.replace(oldPutFile, newPutFile);
content = content.replace(oldPutBinaryFile, newPutBinaryFile);
content = content.replace(oldDeleteFile, newDeleteFile);

fs.writeFileSync('src/lib/github.ts', content);
console.log("Patched github.ts");
