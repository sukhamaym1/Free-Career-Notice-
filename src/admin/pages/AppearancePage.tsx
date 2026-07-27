import React from 'react';
import { LayoutTemplate } from 'lucide-react';

export default function AppearancePage({ type }: { type: string }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <LayoutTemplate className="w-5 h-5 text-blue-500" />
        {type} Settings
      </h3>
      <p className="text-slate-500 dark:text-slate-400">Configure appearance settings, menus, and widgets here.</p>
    </div>
  );
}
