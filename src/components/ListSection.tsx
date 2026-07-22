import { ChevronRight, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListItem {
  title: string;
  salary?: string;
  jobType?: string;
  location?: string;
}

interface ListSectionProps {
  title: string;
  items: (string | ListItem)[];
  viewAllLink?: string;
}

export default function ListSection({ title, items, viewAllLink = "#" }: ListSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="bg-slate-800 dark:bg-slate-950 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-white text-center">{title}</h2>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800 flex-1">
        {items.length === 0 ? (
          <li className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No items found matching the criteria.</li>
        ) : (
          items.map((item, idx) => {
            const itemTitle = typeof item === 'string' ? item : item.title;
            const isObj = typeof item !== 'string';
            
            return (
              <li key={idx}>
                <Link
                  to={isObj && (item as any).id ? `/post/${(item as any).id}` : "/post/wbpsc-recruitment-2026"}
                  className="flex items-start gap-3 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30"></div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                      {itemTitle}
                    </span>
                    
                  </div>
                </Link>
              </li>
            );
          })
        )}
      </ul>
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 text-center mt-auto">
        <Link to={viewAllLink} className="inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
