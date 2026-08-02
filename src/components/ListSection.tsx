import { ChevronRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks';

interface ListItem {
  id?: string;
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
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">{title}</h2>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800 flex-1">
        {items.length === 0 ? (
          <li className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No items found matching the criteria.</li>
        ) : (
          items.map((item, idx) => {
            const itemTitle = typeof item === 'string' ? item : item.title;
            const isObj = typeof item !== 'string';
            const itemId = isObj && (item as ListItem).id ? (item as ListItem).id! : "wbpsc-recruitment-2026";
            const bookmarked = isBookmarked(itemId);
            
            return (
              <li key={idx} className="relative group">
                <Link
                  to={`/post/${itemId}`}
                  className="flex items-start gap-3 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors pr-12"
                >
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30"></div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                      {itemTitle}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark(itemId);
                  }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                    bookmarked 
                      ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-blue-400'
                  }`}
                  aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
                </button>
              </li>
            );
          })
        )}
      </ul>
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-800 text-center mt-auto">
        <Link to={viewAllLink} className="inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
