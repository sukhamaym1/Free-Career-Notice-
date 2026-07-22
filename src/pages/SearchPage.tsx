import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } from '../data';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const allItems = [
    ...JOB_NOTIFICATIONS.map(i => ({ ...i, category: 'Job Notifications' })),
    ...ADMIT_CARDS.map(i => ({ ...i, category: 'Admit Card' })),
    ...RESULTS.map(i => ({ ...i, category: 'Results' }))
  ];

  const searchResults = allItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    (item.tag && item.tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <main className="container mx-auto px-4 py-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <Search className="w-4 h-4" />
          Search Results
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          {query ? `Results for "${query}"` : 'All Search Results'}
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-green-500 mx-auto rounded-full"></div>
      </motion.div>

      {searchResults.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
        >
          <p className="text-gray-500 dark:text-gray-400 text-lg">No results found for "{query}". Try a different keyword.</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {searchResults.map((item, idx) => (
              <motion.div 
                key={item.title + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                layout
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
              {/* Thumbnail Placeholder */}
              <div className={`relative h-48 md:h-64 bg-gradient-to-br ${item.imgGradient || 'from-gray-700 to-gray-900'} p-6 flex flex-col justify-center items-center text-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                
                {/* Tag */}
                {item.tag && (
                  <div className={`absolute top-4 right-4 ${item.tagColor || 'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10 shadow-sm`}>
                    {item.tag}
                  </div>
                )}
                
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                
                {/* Mock content for the thumbnail */}
                <div className="relative z-10 max-w-[80%]">
                  <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight mb-2 uppercase">
                    {item.tag || item.category}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-sm">
                    {item.title.substring(0, 45)}...
                  </p>
                  <div className="mt-4 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full text-sm">
                    Click Here!!!
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">{item.category}</div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link to="/post/wbpsc-recruitment-2026">{item.title}</Link>
                </h2>
                
                <div className="mt-auto">
                  <Link to="/post/wbpsc-recruitment-2026" className="inline-block text-green-600 dark:text-green-500 font-semibold text-sm uppercase tracking-wider mb-4 hover:text-green-700 dark:hover:text-green-400">
                    READ MORE »
                  </Link>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <span>{item.author || 'Sukhamay'}</span>
                    <span className="mx-2">/</span>
                    <span>{item.date || 'March 2026'}</span>
                  </div>
                </div>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}
