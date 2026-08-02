
import { useState, useEffect, useMemo } from 'react';
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
import { createStorageProvider, ContentService, MediaService } from '../lib/storage';
import WebsiteSettings from './components/WebsiteSettings';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import PostsPage from './pages/PostsPage';
import EditorPage from './pages/EditorPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SEOCalculator from './components/SEOCalculator';
import ComingSoon from './components/ComingSoon';
import PagesPage from './pages/PagesPage';
import CommentsPage from './pages/CommentsPage';
import AdsPage from './pages/AdsPage';
import AppearancePage from './pages/AppearancePage';
import UsersPage from './pages/UsersPage';
import ToolsPage from './pages/ToolsPage';

interface AdminDashboardProps {
  onLogout: () => void;
  pat: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AdminDashboard({ onLogout, pat, theme, toggleTheme }: AdminDashboardProps) {
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
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
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
    ADMIT_CARDS: rawPosts.filter(p => p.categorySlug === 'admit-card'),
    RESULTS: rawPosts.filter(p => p.categorySlug === 'results'),
  };

  
  const storageProvider = useMemo(() => createStorageProvider(pat), [pat]);
  const contentService = useMemo(() => new ContentService(storageProvider), [storageProvider]);
  const mediaService = useMemo(() => new MediaService(storageProvider), [storageProvider]);


  useEffect(() => {
    fetchData();
  }, [pat]);

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
      const posts = await contentService.getPosts();
      setRawPosts(posts);

      const cats = await contentService.getCategories();
      setCategories(cats);

      const tgs = await contentService.getTags();
      setTags(tgs);

      const materials = await contentService.getStudyMaterials();
      setStudyMaterials(materials);

      const settings = await contentService.getSettings();
      setSiteSettings(settings);

      const media = await mediaService.listImages();
      setMediaFiles(media);

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
      const postIds = rawPosts.map(p => p.id).filter(id => /^post-\d+$/.test(id));
      const nextIdNumber = postIds.length > 0 ? Math.max(...postIds.map(id => parseInt(id.replace('post-', '')))) + 1 : 1;
      
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
      
      const newPost: any = {
        ...editingPost,
        id: postId,
        title: formData.has('title') ? formData.get('title') : (editingPost?.title || ''),
        seoTitle: formData.has('seoTitle') ? formData.get('seoTitle') : (editingPost?.seoTitle || ''),
        seoDescription: formData.has('seoDescription') ? formData.get('seoDescription') : (editingPost?.seoDescription || ''),
        focusKeyword: formData.has('focusKeyword') ? formData.get('focusKeyword') : (editingPost?.focusKeyword || ''),
        featuredImage: formData.has('featuredImage') ? formData.get('featuredImage') : (editingPost?.featuredImage || ''),
        categorySlug: formData.has('categorySlug') ? formData.get('categorySlug') : (editingPost?.categorySlug || ''),
        content: formData.has('content') ? formData.get('content') : (editingPost?.content || `<p>${formData.get('title')}</p>`),
        author: formData.has('author') ? formData.get('author') : (editingPost?.author || ''),
        date: formData.get('date') ? new Date(formData.get('date') as string).toISOString() : (editingPost?.date || new Date().toISOString()),
        tags: formData.has('tag') ? formData.getAll('tag').filter(Boolean) as string[] : (editingPost?.tags || []),
        tagColor: formData.has('tagColor') ? formData.get('tagColor') : (editingPost?.tagColor || 'bg-green-500'), 
        imgGradient: formData.has('imgGradient') ? formData.get('imgGradient') : (editingPost?.imgGradient || 'from-blue-500 to-indigo-600'),
        salary: formData.has('salary') ? formData.get('salary') : editingPost?.salary,
        jobType: formData.has('jobType') ? formData.get('jobType') : editingPost?.jobType,
        location: formData.has('location') ? formData.get('location') : editingPost?.location,
        status: formData.has('status') ? (formData.get('status') === 'draft' ? 'draft' : 'published') : (editingPost?.status || 'published')
      };
      
      // Clean up undefined/null fields for optional metadata
      ['salary', 'jobType', 'location', 'tagColor', 'imgGradient'].forEach(key => {
        if (newPost[key] === undefined || newPost[key] === null || newPost[key] === '') {
          delete newPost[key];
        }
      });

      await contentService.savePost(newPost as any, isEdit);

      
      // Clear draft after successful save
      localStorage.removeItem(isEdit ? `draftPost-${editingPost.id}` : 'draftPost-new');
      
      setSyncStatus("synced");
      setActiveTab('All Posts');
      setEditingPost(null);
      await fetchData();
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
    }
  };

  const handleDeletePost = async (post: any) => {
    if (!confirm('Delete this post?')) return;
    setSyncStatus('syncing');
    try {
      await contentService.deletePost(post.id);
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
      await contentService.saveCategories(updated);
      setCategories(updated);
      setNewCatName('');
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleDeleteCategory = async (id: string) => {
    setSyncStatus('syncing');
    try {
      const updated = categories.filter(c => c.id !== id);
      await contentService.saveCategories(updated);
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
      await contentService.saveCategories(updated);
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
      await contentService.saveTags(updated);
      setTags(updated);
      setNewTagName('');
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleDeleteTag = async (id: string) => {
    setSyncStatus('syncing');
    try {
      const updated = tags.filter(c => c.id !== id);
      await contentService.saveTags(updated);
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
      await contentService.saveTags(updated);
      setTags(updated);
      setSyncStatus('synced');
    } catch (err) { setSyncStatus('error'); }
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyncStatus('syncing');
    try {
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      await mediaService.uploadImage(file, fileName);
      await fetchData();
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleDeleteMedia = async (file: any) => {
    if (!confirm('Delete this media file?')) return;
    setSyncStatus('syncing');
    try {
      await mediaService.deleteImage(file.path);
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
          await mediaService.deleteImage(file.path);
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
      await mediaService.renameImage(file.path, `public/uploads/${newName}`);
      await fetchData();
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
        siteName: String(formData.get('siteName') || ''),
        description: String(formData.get('description') || ''),
        seoTitle: String(formData.get('seoTitle') || ''),
        keywords: String(formData.get('keywords') || ''),
        googleAnalyticsId: String(formData.get('googleAnalyticsId') || ''),
        publisherId: String(formData.get('publisherId') || '')
      };
      await contentService.saveSettings(updated);
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
          setEditingPost={setEditingPost}
        />
      );
    }

    if (['All Posts', 'Posts', 'Drafts', 'Scheduled', 'Published', 'Trash'].includes(activeTab)) {
      return (
        <PostsPage 
          rawPosts={rawPosts}
          categories={categories}
          setActiveTab={setActiveTab}
          setEditingPost={setEditingPost}
          handleDeletePost={handleDeletePost}
          currentFilter={activeTab as any}
        />
      );
    }

    if (activeTab === 'Create Post' || activeTab === 'Edit Post' || activeTab.endsWith('Builder') || activeTab === 'Table Generator') {
      // For builders, we can pass default template or something. But EditorPage is sufficient for now.
      return (
        <EditorPage 
          editingPost={editingPost}
          handleSavePost={handleSavePost}
          setActiveTab={setActiveTab}
          categories={categories}
          tags={tags}
        />
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

    if (activeTab === 'Study Materials') {
      return (
        <StudyMaterialsPage 
          materials={studyMaterials}
          setMaterials={setStudyMaterials}
          contentService={contentService}
          mediaService={mediaService}
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
          contentService={contentService}
          setSyncStatus={setSyncStatus}
        />
      );
    }

    
    if (activeTab === 'Pages') return <PagesPage />;
    if (activeTab === 'Comments') return <CommentsPage />;
    if (activeTab === 'Advertisement') return <AdsPage />;
    if (['Theme Settings', 'Menus', 'Widgets'].includes(activeTab)) return <AppearancePage type={activeTab} />;
    if (activeTab === 'Users') return <UsersPage />;
    if (activeTab === 'Tools') return <ToolsPage contentService={contentService} />;

    // Default to coming soon for other tabs
    return <ComingSoon title={activeTab} />;
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      theme={theme}
      toggleTheme={toggleTheme}
      onLogout={onLogout}
      onScan={fetchData}
      syncStatus={syncStatus}
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
          
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 ml-1"></div>
          <button 
            onClick={fetchData}
            disabled={syncStatus === 'syncing'}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
            title="Scan & Sync Repository"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {renderContent()}
    </AdminLayout>
  );
}
