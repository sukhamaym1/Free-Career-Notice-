import React from 'react';
import { Activity } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        System Tools
      </h3>
      <div className="space-y-4">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Clear Cache</button>
        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors ml-4">Rebuild Site</button>
      </div>
    </div>
  );
}
