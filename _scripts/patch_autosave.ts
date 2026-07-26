import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetFormStart = `<form onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">`;
const replacementFormStart = `<form id="post-editor-form" onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">`;

const targetHeading = `<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>`;
const replacementHeading = `<div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
            <span id="autosave-indicator" className="text-sm text-slate-500 flex items-center gap-1"></span>
          </div>`;

const targetUseEffect = `  useEffect(() => {
    fetchData();
  }, [githubConfig]);`;

const replacementUseEffect = `  useEffect(() => {
    fetchData();
  }, [githubConfig]);

  useEffect(() => {
    let interval: any;
    if (activeTab === 'Create Post') {
      interval = setInterval(() => {
        const form = document.getElementById('post-editor-form') as HTMLFormElement;
        if (form) {
          const formData = new FormData(form);
          const data: any = Object.fromEntries(formData.entries());
          data.tags = formData.getAll('tag');
          
          const saveKey = editingPost ? \`draftPost-\${editingPost.id}\` : 'draftPost-new';
          localStorage.setItem(saveKey, JSON.stringify(data));
          
          const indicator = document.getElementById('autosave-indicator');
          if (indicator) {
            indicator.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> Saved at \${new Date().toLocaleTimeString()}\`;
            setTimeout(() => {
              if (indicator) indicator.innerHTML = '';
            }, 5000);
          }
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [activeTab, editingPost]);`;

if (content.includes(targetFormStart)) {
  content = content.replace(targetFormStart, replacementFormStart);
}
if (content.includes(targetHeading)) {
  content = content.replace(targetHeading, replacementHeading);
}
if (content.includes(targetUseEffect)) {
  content = content.replace(targetUseEffect, replacementUseEffect);
}

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Patched autosave successfully.');
