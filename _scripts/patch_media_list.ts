import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetUI = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((f, i) => (
              <div key={i} className={\`border \${selectedMedia.includes(f.name) ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-slate-200 dark:border-slate-700'} rounded-lg overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-800 relative group\`}>
                <div className="absolute top-2 left-2 z-10">
                  <input 
                    type="checkbox" 
                    checked={selectedMedia.includes(f.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMedia([...selectedMedia, f.name]);
                      } else {
                        setSelectedMedia(selectedMedia.filter(name => name !== f.name));
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                  />
                </div>
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
            ))}
            {mediaFiles.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No media files found in public/uploads/
              </div>
            )}
          </div>`;

const replacementUI = `<div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="pb-4 pl-4 w-12">
                    <input 
                      type="checkbox" 
                      checked={mediaFiles.length > 0 && selectedMedia.length === mediaFiles.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMedia(mediaFiles.map(f => f.name));
                        } else {
                          setSelectedMedia([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
                    />
                  </th>
                  <th className="pb-4 px-4 w-24">Preview</th>
                  <th className="pb-4 px-4">File Name</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediaFiles.map((f, i) => (
                  <tr key={i} className={\`border-b border-slate-100 dark:border-slate-800/50 transition-colors \${selectedMedia.includes(f.name) ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}\`}>
                    <td className="py-3 pl-4">
                      <input 
                        type="checkbox" 
                        checked={selectedMedia.includes(f.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMedia([...selectedMedia, f.name]);
                          } else {
                            setSelectedMedia(selectedMedia.filter(name => name !== f.name));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 rounded overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <img src={f.download_url || \`/uploads/\${f.name}\`} alt={f.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-sm text-slate-800 dark:text-slate-200">
                      {f.name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            const url = window.location.origin + \`/uploads/\${f.name}\`;
                            navigator.clipboard.writeText(url);
                            alert('Copied URL: ' + url);
                          }} 
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Copy URL">
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRenameMedia(f)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors" title="Rename">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteMedia(f)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {mediaFiles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      No media files found in public/uploads/
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>`;

if (content.includes(targetUI)) {
  content = content.replace(targetUI, replacementUI);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced successfully.');
} else {
  console.log('Target UI not found.');
}
