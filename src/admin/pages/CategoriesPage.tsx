import React from 'react';
import { Folder } from 'lucide-react';

interface CategoriesPageProps {
  categories: any[];
  handleAddCategory: () => void;
  handleEditCategory: (cat: any) => void;
  handleDeleteCategory: (id: string) => void;
  newCatName: string;
  setNewCatName: (name: string) => void;
}

export default function CategoriesPage({
  categories,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
  newCatName,
  setNewCatName
}: CategoriesPageProps) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Folder className="w-5 h-5 text-blue-500" />
        Manage Categories
      </h3>
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="New Category Name" 
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Add Category
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
            {categories.map((cat, i) => (
              <tr key={cat.id || i} className="border-b border-slate-100 dark:border-slate-800/50">
                <td className="py-4 pr-4 font-medium text-slate-800 dark:text-slate-200">{cat.name}</td>
                <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-mono text-sm">{cat.slug}</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => handleEditCategory(cat)} className="text-blue-600 hover:underline mr-4 font-medium text-sm">Edit</button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:underline font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">
                  No categories found. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
