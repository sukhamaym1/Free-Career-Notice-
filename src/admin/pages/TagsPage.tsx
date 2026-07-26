import React from 'react';
import { Tags } from 'lucide-react';

interface TagsPageProps {
  tags: any[];
  handleAddTag: () => void;
  handleEditTag: (tag: any) => void;
  handleDeleteTag: (id: string) => void;
  newTagName: string;
  setNewTagName: (name: string) => void;
}

export default function TagsPage({
  tags,
  handleAddTag,
  handleEditTag,
  handleDeleteTag,
  newTagName,
  setNewTagName
}: TagsPageProps) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Tags className="w-5 h-5 text-blue-500" />
        Manage Tags
      </h3>
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="New Tag Name" 
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="flex-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleAddTag} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Add Tag
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
              <th className="pb-4 pr-4">Name</th>
              <th className="pb-4 px-4">Slug</th>
              <th className="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, i) => (
              <tr key={tag.id || i} className="border-b border-slate-100 dark:border-slate-800/50">
                <td className="py-4 pr-4 font-medium text-slate-800 dark:text-slate-200">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {tag.name}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-mono text-sm">{tag.slug}</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => handleEditTag(tag)} className="text-blue-600 hover:underline mr-4 font-medium text-sm">Edit</button>
                  <button onClick={() => handleDeleteTag(tag.id)} className="text-red-600 hover:underline font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">
                  No tags found. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
