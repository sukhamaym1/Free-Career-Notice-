import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { 
  LayoutDashboard, Edit3, Folder, FileEdit, Image as ImageIcon, 
  MessageSquare, Database, Settings, Megaphone, LogOut, Edit,
  RefreshCw, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  onLogout: () => void;
  githubConfig?: { pat: string, repo: string, branch: string };
}

export default function AdminDashboard({ onLogout, githubConfig }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'unsynced' | 'syncing' | 'error'>('synced');
  const [lastSynced, setLastSynced] = useState<Date | null>(new Date());
  const [fileSha, setFileSha] = useState('');
  
  const [parsedData, setParsedData] = useState<{
    NEW_UPDATES: string[];
    COLOR_BLOCKS: any[];
    JOB_NOTIFICATIONS: any[];
    ADMIT_CARDS: any[];
    RESULTS: any[];
  } | null>(null);

  useEffect(() => {
    if (githubConfig?.pat && githubConfig?.repo) {
      fetchData();
    }
  }, [githubConfig]);

  const fetchData = async () => {
    if (!githubConfig) return;
    
    // Parse the repo URL into owner/repo
    let owner = '', repo = '';
    try {
      const urlParts = new URL(githubConfig.repo).pathname.split('/').filter(Boolean);
      owner = urlParts[0];
      repo = urlParts[1];
    } catch {
      // fallback in case it's just 'owner/repo' string
      const parts = githubConfig.repo.split('/');
      owner = parts[parts.length - 2] || '';
      repo = parts[parts.length - 1] || '';
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/src/data.ts?ref=${githubConfig.branch}`, {
        headers: {
          'Authorization': `Bearer ${githubConfig.pat}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch from GitHub');
      
      const data = await response.json();
      setFileSha(data.sha);
      
      // Decode base64
      const decodedContent = decodeURIComponent(escape(window.atob(data.content)));
      
      // Simple parser replacing exports with vars
      const scriptContent = decodedContent.replace(/export const/g, 'var');
      const parseFunc = new Function(scriptContent + '\nreturn { NEW_UPDATES, COLOR_BLOCKS, JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS };');
      const parsed = parseFunc();
      
      setParsedData(parsed);
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const handleSync = async () => {
    if (!githubConfig || !parsedData || !fileSha) return;
    setSyncStatus('syncing');
    
    let owner = '', repo = '';
    try {
      const urlParts = new URL(githubConfig.repo).pathname.split('/').filter(Boolean);
      owner = urlParts[0];
      repo = urlParts[1];
    } catch {
      const parts = githubConfig.repo.split('/');
      owner = parts[parts.length - 2] || '';
      repo = parts[parts.length - 1] || '';
    }

    try {
      // Re-generate the file content
      let newContent = '';
      newContent += `export const NEW_UPDATES = ${JSON.stringify(parsedData.NEW_UPDATES, null, 2)};\n\n`;
      newContent += `export const COLOR_BLOCKS = ${JSON.stringify(parsedData.COLOR_BLOCKS, null, 2)};\n\n`;
      newContent += `export const JOB_NOTIFICATIONS = ${JSON.stringify(parsedData.JOB_NOTIFICATIONS, null, 2)};\n\n`;
      newContent += `export const ADMIT_CARDS = ${JSON.stringify(parsedData.ADMIT_CARDS, null, 2)};\n\n`;
      newContent += `export const RESULTS = ${JSON.stringify(parsedData.RESULTS, null, 2)};\n`;

      const encodedContent = window.btoa(unescape(encodeURIComponent(newContent)));

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/src/data.ts`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubConfig.pat}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update data.ts via Admin Panel`,
          content: encodedContent,
          sha: fileSha,
          branch: githubConfig.branch
        })
      });

      if (!response.ok) throw new Error('Failed to push to GitHub');
      
      const data = await response.json();
      setFileSha(data.content.sha);
      
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
    }
  };

  // Rest of the component remains the same, we'll update the button next


  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Create Post', icon: Edit3 },
    { name: 'All Posts', icon: Folder },
    { name: 'Drafts', icon: FileEdit },
    { name: 'Categories', icon: Folder },
    { name: 'Media Library', icon: ImageIcon },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Backup & Restore', icon: Database },
    { name: 'Settings', icon: Settings },
    { name: 'Advertisement', icon: Megaphone },
  ];

  const renderContent = () => {
    if (!parsedData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
        </div>
      );
    }

    if (activeTab === 'Dashboard') {
      return (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">{parsedData.JOB_NOTIFICATIONS.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Jobs</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">{parsedData.ADMIT_CARDS.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Admit Cards</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">{parsedData.RESULTS.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Results</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">{parsedData.NEW_UPDATES.length}</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">New Updates</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Recent Job Notifications</h3>
                <button onClick={() => setActiveTab('All Posts')} className="px-4 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-sm font-medium rounded-md transition-colors">
                  View All
                </button>
              </div>
              <div className="p-6 overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm font-semibold text-slate-400 border-b border-slate-700/50">
                      <th className="pb-4 pr-4">Title</th>
                      <th className="pb-4 px-4">Category</th>
                      <th className="pb-4 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.JOB_NOTIFICATIONS.slice(0, 5).map((job, i) => (
                      <tr key={i}>
                        <td className="py-4 pr-4 border-b border-slate-800/50 font-medium text-slate-200 max-w-[200px] truncate">
                          {job.title}
                        </td>
                        <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400">
                          {job.tag}
                        </td>
                        <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400 text-sm whitespace-nowrap">
                          {job.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setActiveTab('Create Post')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-lg transition-colors font-medium text-sm">
                  <Edit3 className="w-5 h-5 text-yellow-300" />
                  Write a New Article
                </button>
                <button 
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Database className={`w-5 h-5 text-sky-400 ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync with GitHub'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'All Posts') {
      return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">All Job Notifications</h3>
          </div>
          <div className="p-6 overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold text-slate-400 border-b border-slate-700/50">
                  <th className="pb-4 pr-4">Title</th>
                  <th className="pb-4 px-4">Category</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4">Author</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.JOB_NOTIFICATIONS.map((job, i) => (
                  <tr key={i}>
                    <td className="py-4 pr-4 border-b border-slate-800/50 font-medium text-slate-200">
                      {job.title}
                    </td>
                    <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400">
                      <span className={`px-2 py-1 rounded text-xs text-white ${job.tagColor}`}>
                        {job.tag}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400 text-sm whitespace-nowrap">
                      {job.date}
                    </td>
                    <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400 text-sm">
                      {job.author}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'Create Post') {
      const handleCreate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPost = {
          title: formData.get('title'),
          author: formData.get('author'),
          date: formData.get('date'),
          tag: formData.get('tag'),
          tagColor: 'bg-green-500', // Default
          imgGradient: 'from-blue-500 to-indigo-600', // Default
          salary: formData.get('salary'),
          jobType: formData.get('jobType'),
          location: formData.get('location'),
        };

        setParsedData({
          ...parsedData,
          JOB_NOTIFICATIONS: [newPost, ...parsedData.JOB_NOTIFICATIONS]
        });
        setSyncStatus('unsynced');
        setActiveTab('All Posts');
      };

      return (
        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-white mb-6">Create New Job Notification</h3>
          <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input name="title" required className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Author</label>
                <input name="author" defaultValue="Sukhamay" required className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                <input name="date" type="text" placeholder="e.g. May 15, 2026" required className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tag (Category)</label>
                <input name="tag" defaultValue="JOB NOTIFICATIONS" required className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Job Type</label>
                <input name="jobType" defaultValue="Full-Time" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Salary</label>
                <input name="salary" placeholder="e.g. $40k - $60k" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <input name="location" placeholder="e.g. All India" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="pt-4 flex gap-4">
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Save & Preview
              </button>
              <button type="button" onClick={() => setActiveTab('Dashboard')} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                Cancel
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white font-bold text-lg cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
            <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            Needful Blog CMS
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
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[#0ea5e9] text-white font-medium' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white mb-0">{activeTab}</h1>
            
            <div className="flex items-center gap-3 bg-[#1e293b] px-4 py-2 rounded-lg border border-slate-700/50">
              <div className="flex items-center gap-2">
                {syncStatus === 'synced' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {syncStatus === 'unsynced' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
                {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                
                <span className="text-sm font-medium text-slate-300">
                  {syncStatus === 'synced' && 'All changes synced'}
                  {syncStatus === 'unsynced' && 'Unsynced changes'}
                  {syncStatus === 'syncing' && 'Syncing to GitHub...'}
                  {syncStatus === 'error' && 'Sync failed'}
                </span>
              </div>
              
              {lastSynced && (
                <>
                  <div className="w-px h-4 bg-slate-700"></div>
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

      {/* Floating Action Button */}
      <button 
        onClick={() => setActiveTab('Create Post')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0ea5e9] hover:bg-[#0284c7] rounded-full shadow-lg flex items-center justify-center text-white transition-colors z-50 md:hidden"
      >
        <Edit className="w-6 h-6" />
      </button>
    </div>
  );
}
