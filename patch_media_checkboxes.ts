import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

// Add state
content = content.replace(
  /const \[mediaFiles, setMediaFiles\] = useState<any\[\]>\(\[\]\);/,
  "const [mediaFiles, setMediaFiles] = useState<any[]>([]);\n  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);"
);

// Add function
const bulkDeleteFunc = `
  const handleBulkDeleteMedia = async () => {
    if (!selectedMedia.length || !confirm(\`Delete \${selectedMedia.length} media files?\`)) return;
    setSyncStatus('syncing');
    try {
      for (const name of selectedMedia) {
        const file = mediaFiles.find(f => f.name === name);
        if (file) {
          await client.deleteFile(file.path, \`Delete \${file.name}\`, file.sha);
        }
      }
      setSelectedMedia([]);
      await fetchData();
    } catch (err) {
      setSyncStatus('error');
    }
  };
`;

content = content.replace(
  /const handleRenameMedia = async/,
  bulkDeleteFunc + "\n  const handleRenameMedia = async"
);

// Add selected options UI & checkboxes
const targetUI = `<div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Media Library</h3>
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
              <DownloadCloud className="w-4 h-4" />
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={handleUploadMedia} />
            </label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-800">
                <img src={\`/uploads/\${f.name}\`} alt={f.name} className="w-full h-32 object-cover" />`;

const replacementUI = `<div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Media Library</h3>
            <div className="flex items-center gap-3">
              {selectedMedia.length > 0 && (
                <button 
                  onClick={handleBulkDeleteMedia}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedMedia.length})
                </button>
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                <DownloadCloud className="w-4 h-4" />
                Upload Image
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadMedia} />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                <img src={\`/uploads/\${f.name}\`} alt={f.name} className="w-full h-32 object-cover" />`;

if (content.includes(targetUI)) {
  content = content.replace(targetUI, replacementUI);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced successfully.');
} else {
  console.log('Target UI not found.');
}
