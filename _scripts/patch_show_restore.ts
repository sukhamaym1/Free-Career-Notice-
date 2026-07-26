import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetUseEffect = `  useEffect(() => {
    let interval: any;
    if (activeTab === 'Create Post') {
      interval = setInterval(() => {`;

const replacementUseEffect = `  useEffect(() => {
    let interval: any;
    if (activeTab === 'Create Post') {
      const saveKey = editingPost ? \`draftPost-\${editingPost.id}\` : 'draftPost-new';
      if (localStorage.getItem(saveKey)) {
        setTimeout(() => {
          const btn = document.getElementById('restore-draft-btn');
          if (btn) btn.classList.remove('hidden');
        }, 100);
      }
      
      interval = setInterval(() => {`;

if (content.includes(targetUseEffect)) {
  content = content.replace(targetUseEffect, replacementUseEffect);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Patched show restore successfully.');
} else {
  console.log('UseEffect not found.');
}
