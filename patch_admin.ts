import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetForm = `          <form id="post-editor-form" onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Main Content Area */}
            <div className="flex-1 space-y-6 min-w-0">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  name="title" 
                  defaultValue={editingPost?.title || ''} 
                  required 
                  onChange={(e) => {
                    const title = e.target.value;
                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                    if (!editingPost && slugInput && slugInput.getAttribute('data-user-edited') !== 'true') {
                      slugInput.value = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
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
            </div>`;

const replacementForm = `          <form id="post-editor-form" onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto pb-20">
            {/* Main Content Area - WordPress Style */}
            <div className="flex-1 space-y-8 min-w-0">
              
              {/* Title - Borderless, Large */}
              <div className="bg-white dark:bg-[#0f172a] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <input 
                  name="title" 
                  defaultValue={editingPost?.title || ''} 
                  required 
                  placeholder="Add title"
                  onChange={(e) => {
                    const title = e.target.value;
                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                    if (!editingPost && slugInput && slugInput.getAttribute('data-user-edited') !== 'true') {
                      slugInput.value = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    }
                  }}
                  className="w-full bg-transparent text-4xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none mb-6" 
                />
                
                <div className="min-h-[500px]">
                  <input type="hidden" name="content" id="editor-content" defaultValue={editingPost?.content || ''} />
                  <RichTextEditor 
                    content={editingPost?.content || ''}
                    onChange={(html) => {
                      const input = document.getElementById('editor-content') as HTMLInputElement;
                      if (input) input.value = html;
                    }}
                  />
                </div>
              </div>

              {/* Custom Fields / Excerpt (WP Style) */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Job Details (Custom Fields)</h4>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                    <input name="jobType" defaultValue={editingPost?.jobType || ''} placeholder="e.g. Full-time, Remote" className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Salary</label>
                    <input name="salary" defaultValue={editingPost?.salary || ''} placeholder="e.g. $80k - $120k" className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                  </div>
                </div>
              </div>
            </div>`;

if (content.includes(targetForm)) {
  content = content.replace(targetForm, replacementForm);
} else {
  console.log("Could not find targetForm");
}

const targetSidebar = `            {/* Sidebar Area */}
            <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 space-y-6">`;

const replacementSidebar = `            {/* Sidebar Area - WP Style */}
            <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 space-y-6">`;

if (content.includes(targetSidebar)) {
  content = content.replace(targetSidebar, replacementSidebar);
} else {
  console.log("Could not find targetSidebar");
}

// Make sidebar boxes WP-style

const targetPublishBox = `              {/* Publish Box */}
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
              </div>`;

const replacementPublishBox = `              {/* Publish Box */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Publish</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex flex-col gap-3">
                    <button type="submit" data-action="publish" className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm">
                      {isEdit ? 'Update & Publish' : 'Publish Post'}
                    </button>
                    <div className="flex gap-2">
                      <button type="submit" data-action="draft" className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors text-sm text-center">
                        Save Draft
                      </button>
                      <button type="button" onClick={() => { setActiveTab('Dashboard'); setEditingPost(null); }} className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors text-sm text-center">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>`;

if (content.includes(targetPublishBox)) {
  content = content.replace(targetPublishBox, replacementPublishBox);
} else {
  console.log("Could not find targetPublishBox");
}

const targetStatusAndSchedule = `              {/* Status & Schedule */}
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
              </div>`;

const replacementStatusAndSchedule = `              {/* Status & Schedule */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Post Settings</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Publish Date & Time</label>
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
                      className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:dark:invert text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author</label>
                    <input name="author" defaultValue={editingPost?.author || 'Admin'} required className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>`;

if (content.includes(targetStatusAndSchedule)) {
  content = content.replace(targetStatusAndSchedule, replacementStatusAndSchedule);
} else {
  console.log("Could not find targetStatusAndSchedule");
}

const targetSEOSection = `              {/* SEO Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4" /> SEO Settings
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Focus Keyword</label>
                  <input name="focusKeyword" defaultValue={editingPost?.focusKeyword || ''} placeholder="e.g. software engineer jobs" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                  <input 
                    name="slug" 
                    defaultValue={editingPost?.id || ''} 
                    disabled={!!editingPost} 
                    placeholder="e.g. my-seo-post" 
                    onChange={(e) => {
                      if (e.target.value === '') {
                        e.target.removeAttribute('data-user-edited');
                      } else {
                        e.target.setAttribute('data-user-edited', 'true');
                      }
                    }}
                    className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate from title.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                  <input name="seoTitle" defaultValue={editingPost?.seoTitle || ''} placeholder="Optimized title" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                  <textarea name="seoDescription" defaultValue={editingPost?.seoDescription || ''} rows={3} placeholder="Brief description for search results" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>`;

const replacementSEOSection = `              {/* SEO Section */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-500" /> SEO Parameters
                  </h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Focus Keyword</label>
                    <input name="focusKeyword" defaultValue={editingPost?.focusKeyword || ''} placeholder="e.g. software engineer jobs" className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL Slug</label>
                    <input 
                      name="slug" 
                      defaultValue={editingPost?.id || ''} 
                      disabled={!!editingPost} 
                      placeholder="e.g. my-seo-post" 
                      onChange={(e) => {
                        if (e.target.value === '') {
                          e.target.removeAttribute('data-user-edited');
                        } else {
                          e.target.setAttribute('data-user-edited', 'true');
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm" 
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate from title.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Title</label>
                    <input name="seoTitle" defaultValue={editingPost?.seoTitle || ''} placeholder="Optimized title" className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                    <textarea name="seoDescription" defaultValue={editingPost?.seoDescription || ''} rows={3} placeholder="Brief description for search results" className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>`;

if (content.includes(targetSEOSection)) {
  content = content.replace(targetSEOSection, replacementSEOSection);
} else {
  console.log("Could not find targetSEOSection");
}

const targetOrganization = `              {/* Organization */}
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
              </div>`;

const replacementOrganization = `              {/* Organization */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Categories & Tags</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select name="categorySlug" defaultValue={editingPost?.categorySlug || 'new-updates'} required className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none">
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                    <select name="tag" multiple defaultValue={editingPost?.tags || []} className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm">
                      <option disabled value="">Select tags...</option>
                      {tags.map(t => (
                        <option key={t.id} value={t.slug}>{t.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
                  </div>
                </div>
              </div>`;

if (content.includes(targetOrganization)) {
  content = content.replace(targetOrganization, replacementOrganization);
} else {
  console.log("Could not find targetOrganization");
}

const targetFeaturedImage = `              {/* Featured Image */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Featured Image URL</label>
                  <input name="featuredImage" defaultValue={editingPost?.featuredImage || ''} placeholder="/uploads/image.jpg" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>`;

const replacementFeaturedImage = `              {/* Featured Image */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Featured Image</h4>
                </div>
                <div className="p-5">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-[#1e293b]">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                      <Image className="w-6 h-6" />
                    </div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                    <input name="featuredImage" defaultValue={editingPost?.featuredImage || ''} placeholder="e.g. https://example.com/image.jpg" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center" />
                    <p className="text-xs text-slate-500 mt-3">Provide a URL for the post's featured image.</p>
                  </div>
                </div>
              </div>`;

if (content.includes(targetFeaturedImage)) {
  content = content.replace(targetFeaturedImage, replacementFeaturedImage);
} else {
  console.log("Could not find targetFeaturedImage");
}

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Patched AdminDashboard.tsx successfully.');
