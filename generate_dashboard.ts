import fs from 'fs';

const content = `
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { 
  LayoutDashboard, Edit3, Folder, FileEdit, Image as ImageIcon, 
  MessageSquare, Database, Settings, Megaphone, LogOut, Edit,
  RefreshCw, CheckCircle2, AlertCircle, Clock, Search, Moon, Sun, Menu, ChevronLeft, ChevronRight, Tags,
  LayoutTemplate, Users, Activity, Trash2, Link as LinkIcon, DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { GitHubClient } from '../../lib/github';

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
  const [syncStatus, setSyncStatus] = useState<'synced' | 'unsynced' | 'syncing' | 'error'>('synced');
  const [lastSynced, setLastSynced] = useState<Date | null>(new Date());
  
  const [rawPosts, setRawPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({});
  
  const [categoriesSha, setCategoriesSha] = useState('');
  const [tagsSha, setTagsSha] = useState('');
  const [settingsSha, setSettingsSha] = useState('');

  const [editingPost, setEditingPost] = useState<any>(null);

  const [newCatName, setNewCatName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const parsedData = {
    NEW_UPDATES: rawPosts.filter(p => p.categorySlug === 'new-updates'),
    COLOR_BLOCKS: rawPosts.filter(p => p.categorySlug === 'color-blocks'),
    JOB_NOTIFICATIONS: rawPosts.filter(p => p.categorySlug === 'job-notifications'),
    ADMIT_CARDS: rawPosts.filter(p => p.categorySlug === 'admit-cards'),
    RESULTS: rawPosts.filter(p => p.categorySlug === 'results'),
  };

  const client = new GitHubClient(githubConfig.pat, githubConfig.repo, githubConfig.branch);

  useEffect(() => {
    fetchData();
  }, [githubConfig]);

  const fetchData = async () => {
    setSyncStatus('syncing');
    try {
      const files = await client.listDirectory('content/posts');
      const postPromises = files.map((f: any) => client.getFile(f.path).then(res => ({ ...res, path: f.path })));
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
      
      const setRes = await client.getFile('website/settings.json');
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
      const postId = isEdit ? editingPost.id : \`post-\${String(nextIdNumber).padStart(3, '0')}\`;
      
      const newPost = {
        id: postId,
        title: formData.get('title'),
        categorySlug: formData.get('categorySlug'),
        content: formData.get('content') || \`<p>\${formData.get('title')}</p>\`,
        author: formData.get('author'),
        date: formData.get('date'),
        tags: [formData.get('tag')].filter(Boolean),
        tagColor: formData.get('tagColor') || 'bg-green-500', 
        imgGradient: formData.get('imgGradient') || 'from-blue-500 to-indigo-600',
        salary: formData.get('salary'),
        jobType: formData.get('jobType'),
        location: formData.get('location'),
        status: action === 'draft' ? 'draft' : 'published'
      };

      await client.putFile(
        \`content/posts/\${newPost.id}.json\`,
        JSON.stringify(newPost, null, 2),
        isEdit ? \`Update post \${newPost.id}\` : \`Create post \${newPost.id}\`,
        isEdit ? editingPost._sha : undefined
      );

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
      await client.deleteFile(post._path, \`Delete post \${post.id}\`, post._sha);
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
      const updated = [...categories, { id: \`cat_\${Date.now()}\`, name: newCatName, slug }];
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

  const handleAddTag = async () => {
    if (!newTagName) return;
    setSyncStatus('syncing');
    try {
      const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const updated = [...tags, { id: \`tag_\${Date.now()}\`, name: newTagName, slug }];
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

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyncStatus('syncing');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        await client.putBinaryFile(\`public/uploads/\${fileName}\`, base64Content, \`Upload \${fileName}\`);
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
      await client.deleteFile(file.path, \`Delete \${file.name}\`, file.sha);
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
    { name: 'Settings', icon: Settings },
  ];

  const filteredPosts = rawPosts.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorySlug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 dark:text-[#38bdf8] mb-2">{parsedData.JOB_NOTIFICATIONS.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Total Jobs</div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 dark:text-[#38bdf8] mb-2">{parsedData.ADMIT_CARDS.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Admit Cards</div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 dark:text-[#38bdf8] mb-2">{parsedData.RESULTS.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Results</div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 dark:text-[#38bdf8] mb-2">{parsedData.NEW_UPDATES.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">New Updates</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Posts</h3>
                <button onClick={() => setActiveTab('All Posts')} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium rounded-md transition-colors text-slate-700 dark:text-slate-200">
                  View All
                </button>
              </div>
              <div className="p-6 overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                      <th className="pb-4 pr-4">Title</th>
                      <th className="pb-4 px-4">Category</th>
                      <th className="pb-4 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawPosts.slice(0, 5).map((job, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 pr-4 border-b border-slate-100 dark:border-slate-800/50 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                          {job.title}
                        </td>
                        <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                          {job.categorySlug}
                        </td>
                        <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                          {job.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => { setEditingPost(null); setActiveTab('Create Post'); }} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 dark:bg-[#0ea5e9] hover:bg-blue-700 dark:hover:bg-[#0284c7] text-white rounded-lg transition-colors font-medium text-sm">
                  <Edit3 className="w-5 h-5 text-blue-100 dark:text-yellow-300" />
                  Write a New Post
                </button>
                <button 
                  onClick={fetchData}
                  disabled={syncStatus === 'syncing'}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-transparent"
                >
                  <RefreshCw className={\`w-5 h-5 text-blue-600 dark:text-sky-400 \${syncStatus === 'syncing' ? 'animate-spin' : ''}\`} />
                  {syncStatus === 'syncing' ? 'Fetching...' : 'Refresh from GitHub'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'All Posts') {
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Posts</h3>
            <button onClick={() => { setEditingPost(null); setActiveTab('Create Post'); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
              + Add New
            </button>
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
                      <span className={cn("px-2 py-1 rounded text-xs text-white", job.status === 'draft' ? "bg-amber-500" : "bg-emerald-500")}>
                        {job.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                      {job.date}
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
          <form onSubmit={handleSavePost} className="space-y-4 max-w-4xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input name="title" defaultValue={editingPost?.title || ''} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
                <input name="author" defaultValue={editingPost?.author || 'Admin'} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input name="date" type="text" defaultValue={editingPost?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category (Slug)</label>
                <select name="categorySlug" defaultValue={editingPost?.categorySlug || 'new-updates'} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.length > 0 ? categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  )) : (
                    <>
                      <option value="new-updates">New Updates</option>
                      <option value="job-notifications">Job Notifications</option>
                      <option value="admit-cards">Admit Cards</option>
                      <option value="results">Results</option>
                      <option value="color-blocks">Color Blocks (Hero)</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Type (Optional)</label>
                <input name="jobType" defaultValue={editingPost?.jobType || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tag (Optional)</label>
                <select name="tag" defaultValue={editingPost?.tags?.[0] || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">None</option>
                  {tags.map(t => (
                    <option key={t.id} value={t.slug}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary (Optional)</label>
                <input name="salary" defaultValue={editingPost?.salary || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            
            <div className="min-h-[400px]">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
              <input type="hidden" name="content" id="editor-content" defaultValue={editingPost?.content || ''} />
              <RichTextEditor 
                content={editingPost?.content || ''}
                onChange={(html) => {
                  const input = document.getElementById('editor-content') as HTMLInputElement;
                  if (input) input.value = html;
                }}
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" data-action="publish" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                {isEdit ? 'Update & Publish' : 'Publish Post'}
              </button>
              <button type="submit" data-action="draft" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
                Save as Draft
              </button>
              <button type="button" onClick={() => { setActiveTab('Dashboard'); setEditingPost(null); }} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (activeTab === 'Categories') {
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Manage Categories</h3>
          
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
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{cat.slug}</td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'Tags') {
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Manage Tags</h3>
          
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
                  <td className="py-4 pr-4 font-medium text-slate-800 dark:text-slate-200">{tag.name}</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{tag.slug}</td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => handleDeleteTag(tag.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'Media Library') {
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden animate-in fade-in duration-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Media Library</h3>
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
              <DownloadCloud className="w-4 h-4" />
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={handleUploadMedia} />
            </label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden group relative bg-slate-50 dark:bg-slate-800">
                <img src={\`/uploads/\${f.name}\`} alt={f.name} className="w-full h-32 object-cover" />
                <div className="p-2 truncate text-xs text-slate-600 dark:text-slate-400 text-center bg-white dark:bg-[#1e293b]">
                  {f.name}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(\`/uploads/\${f.name}\`);
                      alert('Copied to clipboard!');
                    }} 
                    className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-200" title="Copy URL">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteMedia(f)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {mediaFiles.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No media files found in public/uploads/
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'Settings') {
      return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Site Settings</h3>
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Name</label>
              <input name="siteName" defaultValue={siteSettings.siteName || ''} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea name="description" defaultValue={siteSettings.description || ''} rows={3} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SEO Title</label>
              <input name="seoTitle" defaultValue={siteSettings.seoTitle || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
              <input name="keywords" defaultValue={siteSettings.keywords || ''} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="pt-4">
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Save Settings
              </button>
            </div>
          </form>
        </div>
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 flex font-sans transition-colors duration-200">
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 fixed md:relative z-40 h-screen",
          isSidebarCollapsed ? "w-20" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer overflow-hidden" onClick={() => setActiveTab('Dashboard')}>
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            {!isSidebarCollapsed && <span className="font-bold text-lg whitespace-nowrap text-slate-800 dark:text-white">CMS Admin</span>}
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    title={isSidebarCollapsed ? item.name : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                      isActive 
                        ? "bg-blue-600 text-white font-medium" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200",
                      isSidebarCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex w-full items-center justify-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors mb-2"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={onLogout}
            title={isSidebarCollapsed ? "Logout" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search everywhere (⌘K)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all focus:w-80"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-0">{activeTab}</h1>
              
              <div className="flex items-center gap-3 bg-white dark:bg-[#1e293b] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
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
            
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => {
          setActiveTab('Create Post');
          setIsMobileMenuOpen(false);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-colors z-20 md:hidden"
      >
        <Edit className="w-6 h-6" />
      </button>
    </div>
  );
}
`

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);

