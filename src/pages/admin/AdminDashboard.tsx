import { useState, useEffect } from 'react';
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

  const handleSync = async () => {
    setSyncStatus('syncing');
    
    // Simulate GitHub API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // If we wanted to actually sync, we would use githubConfig here
      // e.g. push data.ts changes to GitHub
      
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white font-bold text-lg">
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
            <h1 className="text-2xl font-bold text-white mb-0">Dashboard</h1>
            
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
          
          <div>
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">7</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Articles</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">7</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Published</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">0</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Drafts</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">6</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Categories</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Submissions Overview
            </h2>
            
            {/* Bottom Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">0</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Feedback</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">0</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Contacts</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">0</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Today's Messages</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm">
                <div className="text-4xl font-bold text-[#38bdf8] mb-2">0</div>
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Unread Messages</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Articles */}
            <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Recent Articles</h3>
                <button className="px-4 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-sm font-medium rounded-md transition-colors">
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
                      <th className="pb-4 pl-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 pr-4 border-b border-slate-800/50 font-medium text-slate-200 max-w-[200px] truncate">
                        GST Calculator Guide: How to Calculate GST in India (2025)
                      </td>
                      <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400">
                        Tax
                      </td>
                      <td className="py-4 px-4 border-b border-slate-800/50 text-slate-400 text-sm whitespace-nowrap">
                        May 15,<br/>2025
                      </td>
                      <td className="py-4 pl-4 border-b border-slate-800/50 text-right">
                        <span className="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded">
                          Published
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-lg transition-colors font-medium text-sm">
                  <Edit3 className="w-5 h-5 text-yellow-300" />
                  Write a New Article
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-sm">
                  <ImageIcon className="w-5 h-5 text-green-400" />
                  Upload Images
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
      </main>

      {/* Floating Action Button (like in screenshot bottom right) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-300 transition-colors z-50">
        <Edit className="w-6 h-6" />
      </button>
    </div>
  );
}
