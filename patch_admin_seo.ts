import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetSavePost = `const postId = isEdit ? editingPost.id : \`post-\${String(nextIdNumber).padStart(3, '0')}\`;
      
      const newPost = {
        id: postId,
        title: formData.get('title'),
        categorySlug: formData.get('categorySlug'),`;

const replacementSavePost = `const customSlug = formData.get('slug') as string;
      const slugId = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
      const postId = isEdit ? editingPost.id : (slugId || \`post-\${String(nextIdNumber).padStart(3, '0')}\`);
      
      const newPost = {
        ...editingPost,
        id: postId,
        title: formData.get('title'),
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        featuredImage: formData.get('featuredImage'),
        categorySlug: formData.get('categorySlug'),`;

content = content.replace(targetSavePost, replacementSavePost);

const targetForm = `<div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input name="title" defaultValue={editingPost?.title || ''} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>`;

const replacementForm = `<div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input name="title" defaultValue={editingPost?.title || ''} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            {/* SEO Section */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4" /> SEO Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                  <input name="slug" defaultValue={editingPost?.id || ''} disabled={!!editingPost} placeholder="e.g. my-seo-post" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate. Cannot change after creation.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Featured Image URL</label>
                  <input name="featuredImage" defaultValue={editingPost?.featuredImage || ''} placeholder="/uploads/image.jpg" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                <input name="seoTitle" defaultValue={editingPost?.seoTitle || ''} placeholder="Optimized title for search engines" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                <textarea name="seoDescription" defaultValue={editingPost?.seoDescription || ''} rows={2} placeholder="Brief description for search results (approx 150-160 characters)" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>`;

if (content.includes(targetSavePost) && content.includes(targetForm)) {
  content = content.replace(targetSavePost, replacementSavePost);
  content = content.replace(targetForm, replacementForm);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced SEO fields successfully.');
} else {
  console.log('Target text not found.');
  if (!content.includes(targetSavePost)) console.log('targetSavePost not found');
  if (!content.includes(targetForm)) console.log('targetForm not found');
}
