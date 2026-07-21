import { NEW_UPDATES } from '../data';
import { Link } from 'react-router-dom';

export default function NewUpdates() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm mb-8">
      <div className="bg-slate-800 dark:bg-slate-950 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-white text-center">New Updates</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEW_UPDATES.map((update, idx) => (
            <Link
              key={idx}
              to="/post/wbpsc-recruitment-2026"
              className="flex items-start gap-3 group"
            >
              <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full border-2 border-gray-800 dark:border-gray-200 bg-transparent group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 leading-snug">
                {update}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
