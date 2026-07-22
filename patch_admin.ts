import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

// Fix how tags are read when saving a post
content = content.replace(
  /tags: \[formData\.get\('tag'\)\]\.filter\(Boolean\),/g,
  "tags: formData.getAll('tag').filter(Boolean) as string[],"
);

// Fix the tag select input to be multiple
content = content.replace(
  /<select name="tag" defaultValue=\{editingPost\?\.tags\?\.\[0\] \|\| ''\} className="w-full bg-slate-50 dark:bg-\[#0f172a\] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">/g,
  `<select name="tag" multiple defaultValue={editingPost?.tags || []} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32">
                  <option disabled value="">Select tags (Ctrl/Cmd + click for multiple)</option>`
);
// Also remove the '<option value="">None</option>' that comes after it
content = content.replace(
  /<option disabled value="">Select tags \(Ctrl\/Cmd \+ click for multiple\)<\/option>\s*<option value="">None<\/option>/g,
  '<option disabled value="">Select tags (Ctrl/Cmd + click for multiple)</option>'
);


fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
