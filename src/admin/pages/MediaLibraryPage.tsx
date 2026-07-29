import React from 'react';
import { Image as ImageIcon, Search, Trash2, DownloadCloud, Link as LinkIcon, Edit3 } from 'lucide-react';

interface MediaLibraryPageProps {
  mediaFiles: any[];
  selectedMedia: string[];
  setSelectedMedia: (media: string[]) => void;
  mediaSearchQuery: string;
  setMediaSearchQuery: (query: string) => void;
  handleBulkDeleteMedia: () => void;
  handleUploadMedia: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRenameMedia: (file: any) => void;
  handleDeleteMedia: (file: any) => void;
}

export default function MediaLibraryPage({
  mediaFiles,
  selectedMedia,
  setSelectedMedia,
  mediaSearchQuery,
  setMediaSearchQuery,
  handleBulkDeleteMedia,
  handleUploadMedia,
  handleRenameMedia,
  handleDeleteMedia
}: MediaLibraryPageProps) {
  const filteredMedia = mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearchQuery.toLowerCase()));

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
      
      {/* Top Actions & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          Media Library
        </h3>
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
                  checked={filteredMedia.length > 0 && selectedMedia.length === filteredMedia.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMedia(filteredMedia.map(f => f.name));
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
            {filteredMedia.map((f, i) => (
              <tr key={i} className={`border-b border-slate-100 dark:border-slate-800/50 transition-colors ${selectedMedia.includes(f.name) ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
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
                    <img src={f.url || `/uploads/${f.name}`} alt={f.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-sm text-slate-800 dark:text-slate-200">
                  {f.name}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        const url = f.url || (window.location.origin + `/uploads/${f.name}`);
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
            {filteredMedia.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No media found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
