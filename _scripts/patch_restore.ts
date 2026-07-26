import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetHeading2 = `<div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
            <span id="autosave-indicator" className="text-sm text-slate-500 flex items-center gap-1"></span>
          </div>`;

const replacementHeading2 = `
          {/* We will inject local state for drafts */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                id="restore-draft-btn" 
                className="hidden text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                onClick={() => {
                  const saveKey = editingPost ? \`draftPost-\${editingPost.id}\` : 'draftPost-new';
                  const draft = localStorage.getItem(saveKey);
                  if (draft) {
                    try {
                      const data = JSON.parse(draft);
                      const form = document.getElementById('post-editor-form') as HTMLFormElement;
                      if (form) {
                        // Restore basic inputs
                        Object.keys(data).forEach(key => {
                          const input = form.elements.namedItem(key);
                          if (input) {
                            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
                              // Skip multiple select for simple restore, or handle specifically
                              if (input instanceof HTMLSelectElement && input.multiple) {
                                Array.from(input.options).forEach(opt => {
                                  opt.selected = data[key].includes(opt.value);
                                });
                              } else {
                                input.value = data[key];
                              }
                            }
                          }
                        });
                        
                        // Handle RichTextEditor
                        const rtfInput = document.getElementById('editor-content') as HTMLInputElement;
                        if (rtfInput && data.content) {
                          rtfInput.value = data.content;
                          // trigger an event to update the visual editor if necessary
                          // Since RichTextEditor is controlled/uncontrolled via defaultValue, 
                          // a clean way is just re-rendering, but we'll dispatch a custom event.
                          window.dispatchEvent(new CustomEvent('restore-editor-content', { detail: data.content }));
                        }
                        
                        const indicator = document.getElementById('autosave-indicator');
                        if (indicator) {
                          indicator.innerHTML = 'Draft restored';
                          setTimeout(() => {
                            if (indicator) indicator.innerHTML = '';
                          }, 3000);
                        }
                      }
                    } catch (e) {
                      console.error('Failed to restore draft', e);
                    }
                  }
                }}
              >
                <RefreshCw className="w-4 h-4" /> Restore Draft
              </button>
              <span id="autosave-indicator" className="text-sm text-slate-500 flex items-center gap-1"></span>
            </div>
          </div>`;

if (content.includes(targetHeading2)) {
  content = content.replace(targetHeading2, replacementHeading2);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Patched restore draft successfully.');
} else {
  console.log('Heading not found.');
}
