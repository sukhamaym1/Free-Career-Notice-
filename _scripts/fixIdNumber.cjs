const fs = require('fs');

let contentStr = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

const targetStr = `const nextIdNumber = rawPosts.length > 0 ? Math.max(...rawPosts.map(p => parseInt(p.id.replace('post-', '') || '0'))) + 1 : 1;`;

const replacementStr = `const postIds = rawPosts.map(p => p.id).filter(id => /^post-\\d+$/.test(id));
      const nextIdNumber = postIds.length > 0 ? Math.max(...postIds.map(id => parseInt(id.replace('post-', '')))) + 1 : 1;`;

if (contentStr.includes(targetStr)) {
  contentStr = contentStr.replace(targetStr, replacementStr);
  fs.writeFileSync('src/admin/AdminDashboard.tsx', contentStr);
  console.log('Replaced successfully');
} else {
  console.log('Target string not found!');
}
