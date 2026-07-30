import React, { useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';

export default function ToolsPage({ contentService }: any) {
  const [clearing, setClearing] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await contentService.clearCache();
      
      const event = new CustomEvent('show-toast', { 
        detail: { message: 'Cache cleared successfully!' } 
      });
      document.dispatchEvent(event);
    } catch (e: any) {
      console.error(e);
      const event = new CustomEvent('show-toast', { 
        detail: { message: `Failed to clear cache: ${e.message}` } 
      });
      document.dispatchEvent(event);
    } finally {
      setClearing(false);
    }
  };

  const handleRebuild = async () => {
    setRebuilding(true);
    try {
      await contentService.rebuildSite();
      
      const event = new CustomEvent('show-toast', { 
        detail: { message: 'Site rebuild triggered!' } 
      });
      document.dispatchEvent(event);
    } catch (e: any) {
      console.error(e);
      const event = new CustomEvent('show-toast', { 
        detail: { message: `Failed to trigger rebuild: ${e.message}` } 
      });
      document.dispatchEvent(event);
    } finally {
      setRebuilding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        System Tools
      </h3>
      <div className="space-y-4">
        <button 
          onClick={handleClearCache}
          disabled={clearing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 inline-flex"
        >
          {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {clearing ? 'Clearing...' : 'Clear Cache'}
        </button>
        <button 
          onClick={handleRebuild}
          disabled={rebuilding}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors ml-4 disabled:opacity-50 flex items-center gap-2 inline-flex"
        >
          {rebuilding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {rebuilding ? 'Triggering...' : 'Rebuild Site'}
        </button>
      </div>
    </div>
  );
}
