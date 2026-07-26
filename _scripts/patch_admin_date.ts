import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetForm = `<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input name="date" type="text" defaultValue={editingPost?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />`;

const replacementForm = `<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Publish Date & Time (Schedule)</label>
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
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:dark:invert" 
                />`;

if (content.includes(targetForm)) {
  content = content.replace(targetForm, replacementForm);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced Date input successfully.');
} else {
  console.log('Target form not found.');
}
