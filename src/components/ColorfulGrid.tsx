import { COLOR_BLOCKS } from '../data';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function ColorfulGrid() {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6 px-1">
         <Sparkles className="w-5 h-5 text-amber-500" />
         <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Highlight Updates</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLOR_BLOCKS.map((block, idx) => (
          <Link
            key={idx}
            to={block.id ? `/post/${block.id}` : "/post/wbpsc-recruitment-2026"}
            className="group relative flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl hover:shadow-md hover:border-blue-200 dark:hover:border-slate-700 transition-all overflow-hidden"
          >
            {/* Subtle hover background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex items-center gap-4">
               {/* Left accent line */}
               <div className="w-1 h-10 rounded-full bg-blue-500/80 dark:bg-blue-500/50 group-hover:scale-y-125 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-all" />
               <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                 {block.title}
               </h3>
            </div>
            
            <ArrowRight className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all shrink-0 ml-4 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
