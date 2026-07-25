import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetUI = `<div className="flex justify-between items-center mb-6">
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
          
          <div className="overflow-x-auto">
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
                {mediaFiles.map((f, i) => (`;

const replacementUI = `
          {/* Top Actions & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Media Library</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {selectedMedia.length > 0 && (
                  <button 
                    onClick={handleBulkDeleteMedia}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedMedia.length})
                  </button>
                )}
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap">
                  <DownloadCloud className="w-4 h-4" />
                  Upload
                  <input type="file" className="hidden" accept="image/*" onChange={handleUploadMedia} />
                </label>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="pb-4 pl-4 w-12">
                    <input 
                      type="checkbox" 
                      checked={mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearchQuery.toLowerCase())).length > 0 && selectedMedia.length === mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearchQuery.toLowerCase())).length}
                      onChange={(e) => {
                        const filtered = mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearchQuery.toLowerCase()));
                        if (e.target.checked) {
                          setSelectedMedia(filtered.map(f => f.name));
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
                {mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearchQuery.toLowerCase())).map((f, i) => (`;

if (content.includes(targetUI)) {
  content = content.replace(targetUI, replacementUI);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Replaced successfully.');
} else {
  console.log('Target UI not found.');
}
