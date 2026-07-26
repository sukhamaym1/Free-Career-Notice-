
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { 
  LayoutDashboard, Edit3, Folder, FileEdit, Image as ImageIcon, 
  MessageSquare, Database, Settings, Megaphone, LogOut, Edit,
  RefreshCw, CheckCircle2, AlertCircle, Clock, Search, Moon, Sun, Menu, ChevronLeft, ChevronRight, Tags,
  LayoutTemplate, Users, Activity, Trash2, Link as LinkIcon, DownloadCloud, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import RichTextEditor from './components/RichTextEditor';
import { GitHubClient } from '../lib/github';
import WebsiteSettings from './components/WebsiteSettings';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import PostsPage from './pages/PostsPage';
import EditorPage from './pages/EditorPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SEOCalculator from './components/SEOCalculator';

interface AdminDashboardProps {
  onLogout: () => void;
  githubConfig: { pat: string, repo: string, branch: string };
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AdminDashboard({ onLogout, githubConfig, theme, toggleTheme }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'unsynced' | 'syncing' | 'error'>('synced');
  const [lastSynced, setLastSynced] = useState<Date | null>(new Date());
  
  const [rawPosts, setRawPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({});
  
  const [categoriesSha, setCategoriesSha] = useState('');
  const [tagsSha, setTagsSha] = useState('');
  const [settingsSha, setSettingsSha] = useState('');

  const [editingPost, setEditingPost] = useState<any>(null);

  const [newCatName, setNewCatName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const parsedData = {
    NEW_UPDATES: rawPosts.filter(p => p.categorySlug === 'new-updates'),
    COLOR_BLOCKS: rawPosts.filter(p => p.categorySlug === 'highlight-updates'),
    JOB_NOTIFICATIONS: rawPosts.filter(p => p.categorySlug === 'job-notifications'),
    ADMIT_CARDS: rawPosts.filter(p => p.categorySlug === 'admit-cards'),
    RESULTS: rawPosts.filter(p => p.categorySlug === 'results'),
  };

  const client = new GitHubClient(githubConfig.pat, githubConfig.repo, githubConfig.branch);

  useEffect(() => {
    fetchData();
  }, [githubConfig]);

  useEffect(() => {
    let interval: any;
    if (activeTab === 'Create Post') {
      const saveKey = editingPost ? `draftPost-${editingPost.id}` : 'draftPost-new';
      if (localStorage.getItem(saveKey)) {
        setTimeout(() => {
          const btn = document.getElementById('restore-draft-btn');
          if (btn) btn.classList.remove('hidden');
        }, 100);
      }
      
      interval = setInterval(() => {
        const form = document.getElementById('post-editor-form') as HTMLFormElement;
        if (form) {
          const formData = new FormData(form);
          const data: any = Object.fromEntries(formData.entries());
          data.tags = formData.getAll('tag');
          
          const saveKey = editingPost ? `draftPost-${editingPost.id}` : 'draftPost-new';
          localStorage.setItem(saveKey, JSON.stringify(data));
          
          const indicator = document.getElementById('autosave-indicator');
          if (indicator) {
            indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> Saved at ${new Date().toLocaleTimeString()}`;
            setTimeout(() => {
              if (indicator) indicator.innerHTML = '';
            }, 5000);
          }
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [activeTab, editingPost]);

  const fetchData = async () => {
    setSyncStatus('syncing');
    try {
      const files = await client.listDirectory('content/posts');
      const postPromises = files.map((f: any) => client.getFile(f.path).then(async res => {
        if (res && res.content) {
          // Sync to local filesystem
          try {
            await fetch('/api/fs/write', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filePath: f.path, content: res.content })
            });
          } catch (e) {
            console.error('Failed to sync locally', e);
          }
        }
        return { ...res, path: f.path };
      }));
      const postResults = await Promise.all(postPromises);
      const posts = postResults.filter((r: any) => r && r.content).map((r: any) => ({ ...JSON.parse(r.content), _sha: r.sha, _path: r.path }));
      
      posts.sort((a, b) => (b.id > a.id ? 1 : -1));
      setRawPosts(posts);

      const catRes = await client.getFile('content/categories.json');
      if (catRes) {
        setCategories(JSON.parse(catRes.content));
        setCategoriesSha(catRes.sha);
      }
      
      const tagRes = await client.getFile('content/tags.json');
      if (tagRes) {
        setTags(JSON.parse(tagRes.content));
        setTagsSha(tagRes.sha);
      }
      
      const setRes = await client.getFile('content/settings.json');
      if (setRes) {
        setSiteSettings(JSON.parse(setRes.content));
        setSettingsSha(setRes.sha);
      }

      const mediaRes = await client.listDirectory('public/uploads');
      setMediaFiles(mediaRes.filter((f: any) => f.type === 'file'));

      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const handleSavePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const action = (e.nativeEvent as any).submitter?.getAttribute('data-action');
    setSyncStatus('syncing');
    
    try {
      const isEdit = !!editingPost;
      const nextIdNumber = rawPosts.length > 0 ? Math.max(...rawPosts.map(p => parseInt(p.id.replace('post-', '') || '0'))) + 1 : 1;
      
      const title = formData.get('title') as string;
      const customSlug = formData.get('slug') as string;
      
      let slugId = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
      if (!slugId && title) {
        slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (!slugId) {
        slugId = `post-${String(nextIdNumber).padStart(3, '0')}`;
      }
      
      const postId = isEdit ? editingPost.id : slugId;
      
      const newPost = {
        ...editingPost,
        id: postId,
        title: formData.get('title'),
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        focusKeyword: formData.get('focusKeyword'),
        featuredImage: formData.get('featuredImage'),
        categorySlug: formData.get('categorySlug'),
        content: formData.get('content') || `<p>${formData.get('title')}</p>`,
        author: formData.get('author'),
        date: formData.get('date') ? new Date(formData.get('date') as string).toISOString() : new Date().toISOString(),
        tags: formData.getAll('tag').filter(Boolean) as string[],
        tagColor: formData.get('tagColor') || 'bg-green-500', 
        imgGradient: formData.get('imgGradient') || 'from-blue-500 to-indigo-600',
        salary: formData.get('salary'),
        jobType: formData.get('jobType'),
        location: formData.get('location'),
        status: action === 'draft' ? 'draft' : 'published'
      };

      await client.putFile(
        `content/posts/${newPost.id}.json`,
        JSON.stringify(newPost, null, 2),
        isEdit ? `Update post ${newPost.id}` : `Create post ${newPost.id}`,
        isEdit ? editingPost._sha : undefined
      );

      
      // Clear draft after successful save
      localStorage.removeItem(isEdit ? `draftPost-${editingPost.id}` : 'draftPost-new');
      
      await fetchData();
      setActiveTab('All Posts');
      setEditingPost(null);
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
    }
  };

  const handleDeletePost = async (post: any) => {
    if (!confirm('Delete this post?')) return;
    setSyncStatus('syncing');
    try {
      await client.deleteFile(post._path, `Delete post ${post.id}`, post._sha);
      await fetchData();
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    setSyncStatus('syncing');
    try {
      const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const updated = [...categories, { id: `cat_${Date.now()}`, name: newCatName, slug }];
      const res = await client.putFile('content/categories.json', JSON.stringify(updated, null, 2), 'Update categories', categoriesSha || undefined);
      setCategoriesSha(res.content?.sha);
      setCategories(updated);
      setNewCatName('');
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleDeleteCategory = async (id: string) => {
    setSyncStatus('syncing');
    try {
      const updated = categories.filter(c => c.id !== id);
      const res = await client.putFile('content/categories.json', JSON.stringify(updated, null, 2), 'Delete category', categoriesSha || undefined);
      setCategoriesSha(res.content?.sha);
      setCategories(updated);
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleEditCategory = async (cat: any) => {
    const newName = prompt('Enter new category name:', cat.name);
    if (!newName || newName === cat.name) return;
    setSyncStatus('syncing');
    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const updated = categories.map(c => c.id === cat.id ? { ...c, name: newName, slug } : c);
      const res = await client.putFile('content/categories.json', JSON.stringify(updated, null, 2), 'Edit category', categoriesSha || undefined);
      setCategoriesSha(res.content?.sha);
      setCategories(updated);
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleAddTag = async () => {
    if (!newTagName) return;
    setSyncStatus('syncing');
    try {
      const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const updated = [...tags, { id: `tag_${Date.now()}`, name: newTagName, slug }];
      const res = await client.putFile('content/tags.json', JSON.stringify(updated, null, 2), 'Update tags', tagsSha || undefined);
      setTagsSha(res.content?.sha);
      setTags(updated);
      setNewTagName('');
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleDeleteTag = async (id: string) => {
    setSyncStatus('syncing');
    try {
      const updated = tags.filter(c => c.id !== id);
      const res = await client.putFile('content/tags.json', JSON.stringify(updated, null, 2), 'Delete tag', tagsSha || undefined);
      setTagsSha(res.content?.sha);
      setTags(updated);
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleEditTag = async (tag: any) => {
    const newName = prompt('Enter new tag name:', tag.name);
    if (!newName || newName === tag.name) return;
    setSyncStatus('syncing');
    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const updated = tags.map(c => c.id === tag.id ? { ...c, name: newName, slug } : c);
      const res = await client.putFile('content/tags.json', JSON.stringify(updated, null, 2), 'Edit tag', tagsSha || undefined);
      setTagsSha(res.content?.sha);
      setTags(updated);
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyncStatus('syncing');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        await client.putBinaryFile(`public/uploads/${fileName}`, base64Content, `Upload ${fileName}`);
        await fetchData();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleDeleteMedia = async (file: any) => {
    if (!confirm('Delete this media file?')) return;
    setSyncStatus('syncing');
    try {
      await client.deleteFile(file.path, `Delete ${file.name}`, file.sha);
      await fetchData();
    } catch (err) {
      setSyncStatus('error');
    }
  };

  
  const handleBulkDeleteMedia = async () => {
    if (!selectedMedia.length || !confirm(`Delete ${selectedMedia.length} media files?`)) return;
    setSyncStatus('syncing');
    try {
      for (const name of selectedMedia) {
        const file = mediaFiles.find(f => f.name === name);
        if (file) {
          await client.deleteFile(file.path, `Delete ${file.name}`, file.sha);
        }
      }
      setSelectedMedia([]);
      await fetchData();
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleRenameMedia = async (file: any) => {
    const newName = prompt('Enter new file name:', file.name);
    if (!newName || newName === file.name) return;
    setSyncStatus('syncing');
    try {
      const fileData = await client.getRawFile(file.path);
      if (fileData) {
        await client.putBinaryFile(`public/uploads/${newName}`, fileData.content, `Rename to ${newName}`);
        await client.deleteFile(file.path, `Delete old ${file.name}`, file.sha);
        await fetchData();
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleSaveSettings = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSyncStatus('syncing');
    try {
      const updated = {
        siteName: formData.get('siteName'),
        description: formData.get('description'),
        seoTitle: formData.get('seoTitle'),
        keywords: formData.get('keywords'),
        googleAnalyticsId: formData.get('googleAnalyticsId'),
        publisherId: formData.get('publisherId')
      };
      const res = await client.putFile('website/settings.json', JSON.stringify(updated, null, 2), 'Update settings', settingsSha || undefined);
      setSettingsSha(res.content?.sha);
      setSiteSettings(updated);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'All Posts', icon: FileEdit },
    { name: 'Create Post', icon: Edit3 },
    { name: 'Categories', icon: Folder },
    { name: 'Tags', icon: Tags },
    { name: 'Media Library', icon: ImageIcon },
    { name: 'Website Settings', icon: Settings },
  ];

  
  const filterOptions = [...categories];
  Array.from(new Set(rawPosts.map(p => p.categorySlug).filter(Boolean))).forEach((slug: any) => {
    if (!filterOptions.find(c => c.slug === slug)) {
      const name = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      filterOptions.push({ id: slug, slug, name });
    }
  });


  const filteredPosts = rawPosts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.categorySlug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? p.categorySlug === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const renderContent = () => {
    if (syncStatus === 'syncing' && rawPosts.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (activeTab === 'Dashboard') {
      return (
        <DashboardPage 
          parsedData={parsedData}
          rawPosts={rawPosts}
          setActiveTab={setActiveTab}
        />
      );
    }

    if (activeTab === 'All Posts') {
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Posts</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {filterOptions.length > 0 ? filterOptions.map(c => (
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
              <button onClick={() => { setEditingPost(null); setActiveTab('Create Post'); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap">
                + Add New
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="pb-4 pr-4">Title</th>
                  <th className="pb-4 px-4">Category</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((job, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-4 border-b border-slate-100 dark:border-slate-800/50 font-medium text-slate-800 dark:text-slate-200">
                      {job.title}
                    </td>
                    <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-1 rounded text-xs text-white bg-slate-600">
                        {job.categorySlug}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                      <span className={cn("px-2 py-1 rounded text-xs text-white", 
                        job.status === 'draft' ? "bg-amber-500" : 
                        (job.date && new Date(job.date) > new Date() ? "bg-blue-500" : "bg-emerald-500")
                      )}>
                        {job.status === 'draft' ? 'Draft' : (job.date && new Date(job.date) > new Date() ? 'Scheduled' : 'Published')}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                      {new Date(job.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                      <button onClick={() => { setEditingPost(job); setActiveTab('Create Post'); }} className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDeletePost(job)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && (
              <div className="py-8 text-center text-slate-500">No posts found.</div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'Create Post') {
      const isEdit = !!editingPost;
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
          
          {/* We will inject local state for drafts */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                id="restore-draft-btn" 
                className="hidden text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                onClick={() => {
                  const saveKey = editingPost ? `draftPost-${editingPost.id}` : 'draftPost-new';
                  const draft = localStorage.getItem(saveKey);
                  if (draft) {
                    try {
                      const data = JSON.parse(draft);
                      const form = document.getElementById('post-editor-form') as HTMLFormElement;
                      if (form) {
                        // Restore basic inputs
                        Object.keys(data).forEach(key => {
                          const input = form.elements.namedItem(key);
                          if (input) {
                            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
                              // Skip multiple select for simple restore, or handle specifically
                              if (input instanceof HTMLSelectElement && input.multiple) {
                                Array.from(input.options).forEach(opt => {
                                  opt.selected = data[key].includes(opt.value);
                                });
                              } else {
                                input.value = data[key];
                              }
                            }
                          }
                        });
                        
                        // Handle RichTextEditor
                        const rtfInput = document.getElementById('editor-content') as HTMLInputElement;
                        if (rtfInput && data.content) {
                          rtfInput.value = data.content;
                          // trigger an event to update the visual editor if necessary
                          // Since RichTextEditor is controlled/uncontrolled via defaultValue, 
                          // a clean way is just re-rendering, but we'll dispatch a custom event.
                          window.dispatchEvent(new CustomEvent('restore-editor-content', { detail: data.content }));
                        }
                        
                        const indicator = document.getElementById('autosave-indicator');
                        if (indicator) {
                          indicator.innerHTML = 'Draft restored';
                          setTimeout(() => {
                            if (indicator) indicator.innerHTML = '';
                          }, 3000);
                        }
                      }
                    } catch (e) {
                      console.error('Failed to restore draft', e);
                    }
                  }
                }}
              >
                <RefreshCw className="w-4 h-4" /> Restore Draft
              </button>
              <span id="autosave-indicator" className="text-sm text-slate-500 flex items-center gap-1"></span>
            </div>
          </div>
          <form id="post-editor-form" onSubmit={handleSavePost} className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto pb-20">
            {/* Main Content Area - WordPress Style */}
            <div className="flex-1 space-y-8 min-w-0">
              
              {/* Title - Borderless, Large */}
              <div className="bg-white dark:bg-[#0f172a] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <input 
                  name="title" 
                  defaultValue={editingPost?.title || ''} 
                  required 
                  placeholder="Add title"
                  onChange={(e) => {
                    const title = e.target.value;
                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                    if (!editingPost && slugInput && slugInput.getAttribute('data-user-edited') !== 'true') {
                      slugInput.value = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    }
                  }}
                  className="w-full bg-transparent text-4xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none mb-6" 
                />
                
                <div className="min-h-[500px]">
                  <input type="hidden" name="content" id="editor-content" defaultValue={editingPost?.content || ''} />
                  <RichTextEditor 
                    content={editingPost?.content || ''}
                    onChange={(html) => {
                      const input = document.getElementById('editor-content') as HTMLInputElement;
                      if (input) input.value = html;
                    }}
                  />
                </div>
              </div>

              {/* Custom Fields / Excerpt (WP Style) */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Job Details (Custom Fields)</h4>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                    <input name="jobType" defaultValue={editingPost?.jobType || ''} placeholder="e.g. Full-time, Remote" className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Salary</label>
                    <input name="salary" defaultValue={editingPost?.salary || ''} placeholder="e.g. $80k - $120k" className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Area - WP Style */}
            <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 space-y-6">
              
              {/* Publish Box */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Publish</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex flex-col gap-3">
                    <button type="submit" data-action="publish" className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm">
                      {isEdit ? 'Update & Publish' : 'Publish Post'}
                    </button>
                    <div className="flex gap-2">
                      <button type="submit" data-action="draft" className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors text-sm text-center">
                        Save Draft
                      </button>
                      <button type="button" onClick={() => { setActiveTab('Dashboard'); setEditingPost(null); }} className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors text-sm text-center">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Schedule */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Post Settings</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Publish Date & Time</label>
                    <input 
                      name="date" 
                      type="datetime-local" 
                      defaultValue={(() => {
                        if (editingPost?.date) {
                          const d = new Date(editingPost.date);
                          if (!isNaN(d.getTime())) {
                            const tzOffset = d.getTimezoneOffset() * 60000;
                            return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
                          }
                        }
                        const d = new Date();
                        const tzOffset = d.getTimezoneOffset() * 60000;
                        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
                      })()} 
                      required 
                      className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:dark:invert text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author</label>
                    <input name="author" defaultValue={editingPost?.author || 'Admin'} required className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-500" /> SEO Parameters
                  </h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Focus Keyword</label>
                    <input name="focusKeyword" defaultValue={editingPost?.focusKeyword || ''} placeholder="e.g. software engineer jobs" className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL Slug</label>
                    <input 
                      name="slug" 
                      defaultValue={editingPost?.id || ''} 
                      disabled={!!editingPost} 
                      placeholder="e.g. my-seo-post" 
                      onChange={(e) => {
                        if (e.target.value === '') {
                          e.target.removeAttribute('data-user-edited');
                        } else {
                          e.target.setAttribute('data-user-edited', 'true');
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm" 
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave empty to auto-generate from title.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Title</label>
                    <input name="seoTitle" defaultValue={editingPost?.seoTitle || ''} placeholder="Optimized title" className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                    <textarea name="seoDescription" defaultValue={editingPost?.seoDescription || ''} rows={3} placeholder="Brief description for search results" className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* SEO Calculator */}
              <SEOCalculator />

              {/* Organization */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Categories & Tags</h4>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select name="categorySlug" defaultValue={editingPost?.categorySlug || 'new-updates'} required className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none">
                      {filterOptions.length > 0 ? filterOptions.map(c => (
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
                    <select name="tag" multiple defaultValue={editingPost?.tags || []} className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm">
                      <option disabled value="">Select tags...</option>
                      {tags.map(t => (
                        <option key={t.id} value={t.slug}>{t.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Featured Image</h4>
                </div>
                <div className="p-5">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-[#1e293b]">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                      <Image className="w-6 h-6" />
                    </div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
                    <input name="featuredImage" defaultValue={editingPost?.featuredImage || ''} placeholder="e.g. https://example.com/image.jpg" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center" />
                    <p className="text-xs text-slate-500 mt-3">Provide a URL for the post's featured image.</p>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      );
    }

    if (activeTab === 'Categories') {
      return (
        <CategoriesPage 
          categories={categories}
          handleAddCategory={handleAddCategory}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
          newCatName={newCatName}
          setNewCatName={setNewCatName}
        />
      );
    }

    if (activeTab === 'Tags') {
      return (
        <TagsPage 
          tags={tags}
          handleAddTag={handleAddTag}
          handleEditTag={handleEditTag}
          handleDeleteTag={handleDeleteTag}
          newTagName={newTagName}
          setNewTagName={setNewTagName}
        />
      );
    }

    if (activeTab === 'Media Library') {
      return (
        <MediaLibraryPage 
          mediaFiles={mediaFiles}
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
          mediaSearchQuery={mediaSearchQuery}
          setMediaSearchQuery={setMediaSearchQuery}
          handleBulkDeleteMedia={handleBulkDeleteMedia}
          handleUploadMedia={handleUploadMedia}
          handleRenameMedia={handleRenameMedia}
          handleDeleteMedia={handleDeleteMedia}
        />
      );
    }

    if (activeTab === 'Website Settings') {
      return (
        <WebsiteSettings 
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          settingsSha={settingsSha}
          setSettingsSha={setSettingsSha}
          client={client}
          setSyncStatus={setSyncStatus}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Folder className="w-16 h-16 mb-4 opacity-50" />
        <p>This module is under development.</p>
      </div>
    );
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      theme={theme}
      toggleTheme={toggleTheme}
      onLogout={onLogout}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white dark:bg-[#1e293b] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm ml-auto">
          <div className="flex items-center gap-2">
            {syncStatus === 'synced' && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
            {syncStatus === 'unsynced' && <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />}
            {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 text-blue-500 dark:text-sky-400 animate-spin" />}
            {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />}
            
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {syncStatus === 'synced' && 'All changes synced'}
              {syncStatus === 'unsynced' && 'Unsynced changes'}
              {syncStatus === 'syncing' && 'Syncing...'}
              {syncStatus === 'error' && 'Sync failed'}
            </span>
          </div>
          
          {lastSynced && (
            <>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </>
          )}
        </div>
      </div>
      
      {renderContent()}
    </AdminLayout>
  );
}
