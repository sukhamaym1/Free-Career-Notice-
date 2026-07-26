import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const target = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden group relative bg-slate-50 dark:bg-slate-800">
                <img src={\`/uploads/\${f.name}\`} alt={f.name} className="w-full h-32 object-cover" />
                <div className="p-2 truncate text-xs text-slate-600 dark:text-slate-400 text-center bg-white dark:bg-[#1e293b]">
                  {f.name}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(\`/uploads/\${f.name}\`);
                      alert('Copied to clipboard!');
                    }} 
                    className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-200" title="Copy URL">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRenameMedia(f)} className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600" title="Rename">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteMedia(f)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}`;

const replacement = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-800">
                <img src={\`/uploads/\${f.name}\`} alt={f.name} className="w-full h-32 object-cover" />
                <div className="p-2 flex-1 flex flex-col justify-between bg-white dark:bg-[#1e293b]">
                  <div className="truncate text-xs text-slate-600 dark:text-slate-400 text-center mb-2" title={f.name}>
                    {f.name}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        const url = window.location.origin + \`/uploads/\${f.name}\`;
                        navigator.clipboard.writeText(url);
                        alert('Copied URL: ' + url);
                      }} 
                      className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" title="Copy URL">
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleRenameMedia(f)} className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50" title="Rename">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteMedia(f)} className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced successfully.');
} else {
  console.log('Target not found in the file.');
}
