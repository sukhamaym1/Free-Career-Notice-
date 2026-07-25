import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetSavePost = `author: formData.get('author'),
        date: formData.get('date'),`;

const replacementSavePost = `author: formData.get('author'),
        date: formData.get('date') ? new Date(formData.get('date') as string).toISOString() : new Date().toISOString(),`;

if (content.includes(targetSavePost)) {
  content = content.replace(targetSavePost, replacementSavePost);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced date save logic successfully.');
} else {
  console.log('Target save post not found.');
}
