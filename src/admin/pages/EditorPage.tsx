import { useState, useEffect } from 'react';
import { 
  Settings, Image, Link as LinkIcon, DownloadCloud, Activity,
  FileCode2, CheckCircle2, ChevronRight, Maximize, Minimize, Focus, X, Save
} from 'lucide-react';
import { cn } from '../../lib/utils';
import RichTextEditor from '../components/RichTextEditor';
import SEOCalculator from '../components/SEOCalculator';

interface EditorPageProps {
  editingPost: any;
  handleSavePost: (e: React.FormEvent<HTMLFormElement>) => void;
  setActiveTab: (tab: string) => void;
  categories: any[];
  tags: any[];
}

export default function EditorPage({
  editingPost,
  handleSavePost,
  setActiveTab,
  categories,
  tags
}: EditorPageProps) {
  const isEdit = !!editingPost;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  
  // Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullScreen(prev => !prev);
      }
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('post-editor-form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
          setSaveStatus('✓ Saved');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Basic drafts implementation
  useEffect(() => {
    // Restore logic
    const saveKey = editingPost ? `draftPost-${editingPost.id}` : 'draftPost-new';
    if (localStorage.getItem(saveKey)) {
      setTimeout(() => {
        const btn = document.getElementById('restore-draft-btn');
        if (btn) btn.classList.remove('hidden');
      }, 100);
    }
    
    // Autosave logic
    const interval = setInterval(() => {
      const form = document.getElementById('post-editor-form') as HTMLFormElement;
      if (form) {
        const formData = new FormData(form);
        const data: any = Object.fromEntries(formData.entries());
        data.tags = formData.getAll('tag');
        
        localStorage.setItem(saveKey, JSON.stringify(data));
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        setSaveStatus(`Auto Saved at ${time}`);
        
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) {
          indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> Saved at ${new Date().toLocaleTimeString()}`;
          setTimeout(() => {
            if (indicator) indicator.innerHTML = '';
          }, 5000);
        }
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [editingPost]);

  const handleRestoreDraft = () => {
    const saveKey = editingPost ? `draftPost-${editingPost.id}` : 'draftPost-new';
    const draft = localStorage.getItem(saveKey);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        const form = document.getElementById('post-editor-form') as HTMLFormElement;
        if (form) {
          Object.keys(data).forEach(key => {
            if (key === 'tags') return;
            const input = form.elements.namedItem(key) as any;
            if (input && 'value' in input) {
              input.value = data[key];
            }
          });
          
          if (data.tags && Array.isArray(data.tags)) {
            const select = form.elements.namedItem('tag') as HTMLSelectElement;
            if (select) {
              Array.from(select.options).forEach(opt => {
                opt.selected = data.tags.includes(opt.value);
              });
            }
          }
          
          if (data.content) {
            window.dispatchEvent(new CustomEvent('restore-editor-content', { detail: data.content }));
          }
        }
      } catch(e) {
        console.error("Failed to restore draft", e);
      }
    }
  };

  return (
    <div className={cn(
      isFullScreen 
        ? "fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 overflow-y-auto w-screen h-screen" 
        : "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 animate-in fade-in duration-300 relative"
    )}>
      {isFullScreen && (
        <div className="sticky top-0 left-0 right-0 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-[110] flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setIsFullScreen(false)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-sm font-medium">
              <X className="w-4 h-4" /> Exit Full Screen (ESC)
            </button>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
              <button type="button" onClick={() => setIsDistractionFree(!isDistractionFree)} className={cn("px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5", isDistractionFree ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800")}>
                <Maximize className="w-4 h-4" /> Writing Mode
              </button>
              <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className={cn("px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5", isFocusMode ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400" : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800")}>
                <Focus className="w-4 h-4" /> Focus Mode
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-2">{saveStatus}</span>}
            <button type="submit" form="post-editor-form" className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save Post
            </button>
          </div>
        </div>
      )}

      {!isFullScreen && saveStatus && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-100 dark:bg-emerald-900/90 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" /> {saveStatus}
        </div>
      )}

      <div className={cn(
        "transition-all duration-300 mx-auto",
        isFullScreen ? "max-w-7xl pt-8 px-4 pb-12" : ""
      )}>
      {!isFullScreen && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            id="restore-draft-btn" 
            className="hidden text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium"
            onClick={handleRestoreDraft}
          >
            <DownloadCloud className="w-4 h-4" /> Restore Auto-save
          </button>
          <button type="button" onClick={() => setActiveTab('Dashboard')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" form="post-editor-form" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm">
            {isEdit ? 'Update Post' : 'Publish Post'}
          </button>
          <button type="button" onClick={() => setIsFullScreen(true)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm hidden sm:flex">
            <Maximize className="w-4 h-4" /> Full Screen
          </button>
        </div>
      </div>
      )}
      
      <form id="post-editor-form" onSubmit={handleSavePost} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Main Editor Column */}
        <div className={cn("space-y-6 transition-all duration-500 relative", isDistractionFree ? "col-span-3 max-w-4xl mx-auto w-full" : "lg:col-span-2")}>
          
          <div className="editor-title-sticky bg-transparent py-2 transition-all duration-300">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Post Title</label>
            <input 
              name="title" 
              defaultValue={editingPost?.title || ''} 
              required 
              placeholder="Enter a compelling title..." 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-lg" 
              onChange={(e) => {
                const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                if (slugInput && !slugInput.hasAttribute('data-user-edited') && !editingPost) {
                  slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Content</label>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
              <RichTextEditor 
                content={editingPost?.content || ''} 
                onChange={() => {}} // Will be handled via form submission
              />
            </div>
            <textarea 
              name="content" 
              id="hidden-content-input" 
              className="hidden" 
              defaultValue={editingPost?.content || ''}
            ></textarea>
          </div>
          
        </div>
        
        {/* Sidebar Settings Column */}
        {!isDistractionFree && (
            <div className="space-y-6">
          
          {/* Publish Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Publish Settings
              </h4>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Publish Date</label>
                <input 
                  type="datetime-local" 
                  name="date" 
                  defaultValue={editingPost?.date ? new Date(editingPost.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author</label>
                <input 
                  name="author" 
                  defaultValue={editingPost?.author || 'Admin'} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="draft-mode" name="status" value="draft" defaultChecked={editingPost?.status === 'draft'} className="rounded text-blue-600 focus:ring-blue-500 bg-slate-50 border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                <label htmlFor="draft-mode" className="text-sm font-medium text-slate-700 dark:text-slate-300">Save as Draft</label>
              </div>
              <div id="autosave-indicator" className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 h-4"></div>
            </div>
          </div>
          
          {/* Organization */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" /> Organization
              </h4>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select 
                  name="categorySlug" 
                  defaultValue={editingPost?.categorySlug || ''} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.length > 0 ? categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  )) : (
                    <>
                      <option value="job-notifications">Job Notifications</option>
                      <option value="admit-cards">Admit Cards</option>
                      <option value="results">Results</option>
                      <option value="highlight-updates">Highlight Updates</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                <select 
                  name="tag" 
                  multiple 
                  defaultValue={editingPost?.tags || []} 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm custom-scrollbar"
                >
                  {tags.map(t => (
                    <option key={t.id} value={t.slug}>{t.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-500" /> Featured Image
              </h4>
            </div>
            <div className="p-5">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/30">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                  <Image className="w-6 h-6" />
                </div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                <input 
                  name="featuredImage" 
                  defaultValue={editingPost?.featuredImage || ''} 
                  placeholder="https://..." 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center" 
                />
                <p className="text-xs text-slate-500 mt-3">Provide a URL for the post's featured image.</p>
              </div>
            </div>
          </div>
          
          {/* SEO Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" /> SEO Parameters
              </h4>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL Slug</label>
                <input 
                  name="slug" 
                  defaultValue={editingPost?.id || ''} 
                  disabled={!!editingPost} 
                  placeholder="e.g. my-post" 
                  onChange={(e) => {
                    if (e.target.value === '') {
                      e.target.removeAttribute('data-user-edited');
                    } else {
                      e.target.setAttribute('data-user-edited', 'true');
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Title</label>
                <input name="seoTitle" defaultValue={editingPost?.seoTitle || ''} placeholder="Optimized title" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Focus Keyword</label>
                <input name="focusKeyword" defaultValue={editingPost?.focusKeyword || ''} placeholder="e.g. jobs 2026" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                <textarea name="seoDescription" defaultValue={editingPost?.seoDescription || ''} rows={3} placeholder="Brief description for search results" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>
          </div>
          
          <SEOCalculator />

        </div>
      )}
      </form>
      </div>
    </div>
  );
}
