import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetTitle = `                <input name="title" defaultValue={editingPost?.title || ''} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />`;
const replacementTitle = `                <input 
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
                />`;

const targetSlug = `                  <input name="slug" defaultValue={editingPost?.id || ''} disabled={!!editingPost} placeholder="e.g. my-seo-post" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm" />`;
const replacementSlug = `                  <input 
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
                  />`;

if (content.includes(targetTitle)) {
  content = content.replace(targetTitle, replacementTitle);
} else {
  console.log("targetTitle not found");
}

if (content.includes(targetSlug)) {
  content = content.replace(targetSlug, replacementSlug);
} else {
  console.log("targetSlug not found");
}

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Patched title and slug inputs');
