import React from 'react';
import { Hammer } from 'lucide-react';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden p-6 animate-in fade-in duration-300">
      <Hammer className="w-16 h-16 mb-4 opacity-50" />
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <p>This module is under development and will be available soon.</p>
    </div>
  );
}
