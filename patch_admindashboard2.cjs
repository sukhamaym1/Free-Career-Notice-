const fs = require('fs');
const content = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

const target = `      await contentService.savePost(newPost as any, isEdit);
      
      // Clear draft after successful save
      localStorage.removeItem(isEdit ? \`draftPost-\${editingPost.id}\` : 'draftPost-new');
      if (isEdit) {
        setRawPosts(prev => prev.map(p => p.id === newPost.id ? newPost : p));
      } else {
        setRawPosts(prev => [newPost, ...prev]);
      }
      
      setSyncStatus("synced");
      setActiveTab('All Posts');
      setEditingPost(null);`;

const target2 = `      await contentService.savePost(newPost as any, isEdit);
      
      // Clear draft after successful save
      localStorage.removeItem(isEdit ? \`draftPost-\${editingPost.id}\` : 'draftPost-new');
      
      if (isEdit) {
        setRawPosts(prev => prev.map(p => p.id === newPost.id ? newPost : p));
      } else {
        setRawPosts(prev => [newPost, ...prev]);
      }
      
      setSyncStatus("synced");
      setActiveTab('All Posts');
      setEditingPost(null);`;

const replacement = `      await contentService.savePost(newPost as any, isEdit);
      
      // Clear draft after successful save
      localStorage.removeItem(isEdit ? \`draftPost-\${editingPost.id}\` : 'draftPost-new');
      
      setSyncStatus("synced");
      setActiveTab('All Posts');
      setEditingPost(null);

      await fetchData();`;

let newContent = content.replace(target, replacement);
if (newContent === content) {
    newContent = content.replace(target2, replacement);
}

fs.writeFileSync('src/admin/AdminDashboard.tsx', newContent);
