import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const regex = /const isEdit = !!editingPost;\s*const nextIdNumber = rawPosts\.length > 0 \? Math\.max\(\.\.\.rawPosts\.map\(p => parseInt\(p\.id\.replace\('post-', ''\) \|\| '0'\)\)\) \+ 1 : 1;\s*const customSlug = formData\.get\('slug'\) as string;\s*const slugId = customSlug \? customSlug\.toLowerCase\(\)\.replace\(\/\[\^a-z0-9\]\+\/g, '-'\)\.replace\(\/\(\^-\|-\$\)\+\/g, ''\) : '';\s*const postId = isEdit \? editingPost\.id : \(slugId \|\| \`post-\$\{String\(nextIdNumber\)\.padStart\(3, '0'\)\}\`\);/g;

const replacementSaveLogic = `const isEdit = !!editingPost;
      const nextIdNumber = rawPosts.length > 0 ? Math.max(...rawPosts.map(p => parseInt(p.id.replace('post-', '') || '0'))) + 1 : 1;
      
      const title = formData.get('title') as string;
      const customSlug = formData.get('slug') as string;
      
      let slugId = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
      if (!slugId && title) {
        slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (!slugId) {
        slugId = \`post-\${String(nextIdNumber).padStart(3, '0')}\`;
      }
      
      const postId = isEdit ? editingPost.id : slugId;`;

if (regex.test(content)) {
  content = content.replace(regex, replacementSaveLogic);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Patched handleSavePost successfully.');
} else {
  console.log('targetSaveLogic regex not found.');
}
