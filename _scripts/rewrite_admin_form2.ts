import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const regex = /<form onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">([\s\S]*?)<\/form>/;

const replacementForm = `<form onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Main Content Area */}
            <div className="flex-1 space-y-6 min-w-0">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input name="title" defaultValue={editingPost?.title || ''} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="min-h-[400px]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <input type="hidden" name="content" id="editor-content" defaultValue={editingPost?.content || ''} />
                <RichTextEditor 
                  content={editingPost?.content || ''}
                  onChange={(html) => {
                    const input = document.getElementById('editor-content') as HTMLInputElement;
                    if (input) input.value = html;
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Type (Optional)</label>
                  <input name="jobType" defaultValue={editingPost?.jobType || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary (Optional)</label>
                  <input name="salary" defaultValue={editingPost?.salary || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 space-y-6">
              
              {/* Publish Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Publish</h4>
                
                <div className="flex flex-col gap-3">
                  <button type="submit" data-action="publish" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    {isEdit ? 'Update & Publish' : 'Publish Post'}
                  </button>
                  <button type="submit" data-action="draft" className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-medium transition-colors">
                    Save as Draft
                  </button>
                  <button type="button" onClick={() => { setActiveTab('Dashboard'); setEditingPost(null); }} className="w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Status & Schedule */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Publish Date & Time</label>
                  <input 
                    name="date" 
                    type="datetime-local" 
                    defaultValue={(() => {
                      if (editingPost?.date) {
                        const d = new Date(editingPost.date);
                        if (!isNaN(d.getTime())) {
                          const tzOffset = d.getTimezoneOffset() * 60000;
                          return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
                        }
                      }
                      const d = new Date();
                      const tzOffset = d.getTimezoneOffset() * 60000;
                      return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
                    })()} 
                    required 
                    className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:dark:invert text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
                  <input name="author" defaultValue={editingPost?.author || 'Admin'} required className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              {/* SEO Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4" /> SEO Settings
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                  <input name="slug" defaultValue={editingPost?.id || ''} disabled={!!editingPost} placeholder="e.g. my-seo-post" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm" />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                  <input name="seoTitle" defaultValue={editingPost?.seoTitle || ''} placeholder="Optimized title" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                  <textarea name="seoDescription" defaultValue={editingPost?.seoDescription || ''} rows={3} placeholder="Brief description for search results" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              {/* Organization */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select name="categorySlug" defaultValue={editingPost?.categorySlug || 'new-updates'} required className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    {filterOptions.length > 0 ? filterOptions.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    )) : (
                      <>
                        <option value="job-notifications">Job Notifications</option>
                        <option value="admit-cards">Admit Cards</option>
                        <option value="results">Results</option>
                        <option value="highlight-updates">Highlight Updates</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (Optional)</label>
                  <select name="tag" multiple defaultValue={editingPost?.tags || []} className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm">
                    <option disabled value="">Select tags</option>
                    {tags.map(t => (
                      <option key={t.id} value={t.slug}>{t.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Ctrl/Cmd + click for multiple</p>
                </div>
              </div>

              {/* Featured Image */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Featured Image URL</label>
                  <input name="featuredImage" defaultValue={editingPost?.featuredImage || ''} placeholder="/uploads/image.jpg" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

            </div>
          </form>`;

if (regex.test(content)) {
  content = content.replace(regex, replacementForm);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Successfully updated form layout again.');
} else {
  console.log('Regex did not match.');
}
