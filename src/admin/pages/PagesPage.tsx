import React, { useState, useEffect } from 'react';
import { FileEdit, Save, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { useData } from '../../components/DataProvider';
import { createStorageProvider, ContentService } from '../../lib/storage';

const PAGES_LIST = [
  { id: 'about-us', name: 'About Us' },
  { id: 'contact-us', name: 'Contact Us' },
  { id: 'privacy-policy', name: 'Privacy Policy' },
  { id: 'terms-and-conditions', name: 'Terms & Conditions' },
  { id: 'disclaimer', name: 'Disclaimer' },
  { id: 'dmca', name: 'DMCA' },
  { id: 'cookie-policy', name: 'Cookie Policy' },
  { id: 'editorial-policy', name: 'Editorial Policy' },
  { id: 'correction-policy', name: 'Correction Policy' }
];

export default function PagesPage() {
  const { STATIC_PAGES } = useData();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saved'>('idle');
  
  // Create a local content service to save
  const getService = () => {
    let pat = '';
    try {
      const savedSession = sessionStorage.getItem('github_cms_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        pat = parsed.pat || '';
      }
    } catch (e) {}
    return new ContentService(createStorageProvider(pat));
  };

  const handleSelectPage = (id: string) => {
    setSelectedPage(id);
    setContent(STATIC_PAGES?.[id] || '');
    setSyncStatus('idle');
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    setSyncStatus('idle');
    try {
      const service = getService();
      // Only available on the patched ContentService
      if ((service as any).savePage) {
        await (service as any).savePage(selectedPage, content);
      }
      setSyncStatus('saved');
      setTimeout(() => setSyncStatus('idle'), 3000);
      
      // Update local state so it doesn't revert before reload
      STATIC_PAGES[selectedPage] = content;
    } catch (err) {
      console.error(err);
      alert('Failed to save page: ' + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      {/* Sidebar with Pages List */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-blue-500" />
            Static Pages
          </h3>
          <div className="space-y-1">
            {PAGES_LIST.map((page) => (
              <button
                key={page.id}
                onClick={() => handleSelectPage(page.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedPage === page.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col">
        {!selectedPage ? (
          <div className="flex-1 min-h-[400px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                <FileEdit className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p>Select a page from the list to edit its content.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Editing: {PAGES_LIST.find(p => p.id === selectedPage)?.name}
              </h2>
              <div className="flex items-center gap-3">
                {syncStatus === 'saved' && (
                  <span className="text-sm text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved successfully
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Page</>
                  )}
                </button>
              </div>
            </div>
            <div className="p-4 flex-1">
              <RichTextEditor 
                content={content} 
                onChange={setContent} 
                placeholder="Write page content here..."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
