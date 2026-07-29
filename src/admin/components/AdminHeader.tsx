import { Menu, Search, Bell, ExternalLink, Moon, Sun, LogOut, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
  onScan?: () => void;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'unsynced' | 'error';
}

export default function AdminHeader({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsMobileMenuOpen,
  theme,
  toggleTheme,
  onLogout,
  onScan,
  syncStatus
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 transition-colors">
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg w-64 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search posts, settings..."
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {onScan && (
          <button
            onClick={onScan}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            title="Scan & Sync Repository"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Scan Repo</span>
          </button>
        )}
        <Link 
          to="/" 
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Site</span>
        </Link>

        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
