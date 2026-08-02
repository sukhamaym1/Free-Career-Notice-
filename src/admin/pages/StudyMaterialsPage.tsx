import React, { useState, useRef } from 'react';
import { FileText, Plus, Trash2, Edit, Save, X, UploadCloud, Loader2 } from 'lucide-react';
import { StudyMaterial } from '../../lib/storage/types';
import { ContentService, MediaService } from '../../lib/storage';

interface StudyMaterialsPageProps {
  materials: StudyMaterial[];
  setMaterials: (materials: StudyMaterial[]) => void;
  contentService: ContentService;
  mediaService: MediaService;
}

export default function StudyMaterialsPage({
  materials,
  setMaterials,
  contentService,
  mediaService
}: StudyMaterialsPageProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StudyMaterial>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (material: StudyMaterial) => {
    setIsEditing(material.id);
    setFormData(material);
  };

  const handleAddNew = () => {
    setIsEditing('new');
    setFormData({
      id: `sm_${Date.now()}`,
      title: '',
      category: 'UPSC',
      fileSize: '0 MB',
      pages: 0,
      downloads: '0',
      date: new Date().toISOString().split('T')[0],
      color: 'from-blue-500 to-indigo-600',
      description: '',
      author: 'Admin',
      fileUrl: ''
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.title || !formData.fileUrl) {
      alert("Title and PDF file are required");
      return;
    }
    
    setIsSaving(true);
    try {
      let updatedMaterials = [...materials];
      const newMaterial = formData as StudyMaterial;
      
      if (isEditing === 'new') {
        updatedMaterials.unshift(newMaterial);
      } else {
        updatedMaterials = updatedMaterials.map(m => m.id === newMaterial.id ? newMaterial : m);
      }
      
      await contentService.saveStudyMaterials(updatedMaterials);
      setMaterials(updatedMaterials);
      try {
        localStorage.setItem('cached_study_materials', JSON.stringify(updatedMaterials));
        localStorage.setItem('cached_study_materials_timestamp', Date.now().toString());
      } catch (e) {}
      setIsEditing(null);
    } catch (error) {
      alert("Failed to save material");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    
    setIsSaving(true);
    try {
      const updatedMaterials = materials.filter(m => m.id !== id);
      await contentService.saveStudyMaterials(updatedMaterials);
      setMaterials(updatedMaterials);
      try {
        localStorage.setItem('cached_study_materials', JSON.stringify(updatedMaterials));
        localStorage.setItem('cached_study_materials_timestamp', Date.now().toString());
      } catch (e) {}
    } catch (error) {
      alert("Failed to delete material");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const fileName = `pdf_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const url = await mediaService.uploadFile(file, fileName);
      setFormData({ ...formData, fileUrl: url, fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB` });
    } catch (error) {
      alert("Failed to upload PDF");
      console.error(error);
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Manage Study Materials
        </h3>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New PDF
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4">
            {isEditing === 'new' ? 'Add New Material' : 'Edit Material'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input 
                type="text" 
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input 
                type="text" 
                value={formData.category || ''}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
              <input 
                type="text" 
                value={formData.author || ''}
                onChange={e => setFormData({...formData, author: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pages</label>
              <input 
                type="number" 
                value={formData.pages || 0}
                onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input 
                type="date" 
                value={formData.date || ''}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color Gradient (Tailwind)</label>
              <input 
                type="text" 
                value={formData.color || ''}
                onChange={e => setFormData({...formData, color: e.target.value})}
                placeholder="from-blue-500 to-indigo-600"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-900">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">PDF File Upload</label>
              
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPdf}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {uploadingPdf ? 'Uploading...' : 'Select PDF File'}
                </button>
                <input 
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                {formData.fileUrl && (
                  <div className="flex-1 flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-sm">
                    <span className="truncate max-w-[200px]">{formData.fileUrl.split('/').pop()}</span>
                    <span>{formData.fileSize}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? materials.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {item.title}
                    {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" className="block text-xs text-blue-500 mt-1 hover:underline">View PDF</a>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{item.fileSize}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No study materials found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
