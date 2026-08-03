import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../components/DataProvider';
import { User, Check } from 'lucide-react';

export default function AuthorPage() {
  const { PUBLISHED_POSTS, SITE_SETTINGS } = useData();
  const { authorName } = useParams();
  
  const decodedAuthorName = authorName ? decodeURIComponent(authorName) : 'Editor';
  
  const authorPosts = PUBLISHED_POSTS.filter(p => 
    p.author === decodedAuthorName || (!p.author && decodedAuthorName === 'Editor')
  );

  return (
    <main className="container mx-auto px-4 py-8 pb-20 animate-in fade-in duration-500">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-200 dark:border-blue-800/50 shadow-sm">
          <User className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 flex items-center justify-center gap-3">
          {decodedAuthorName}
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm px-3 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800/50 flex items-center gap-1.5 self-center mt-1">
            <Check className="w-4 h-4" /> Verified Expert
          </span>
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          {decodedAuthorName} brings years of expertise in career counseling and government job notifications. Committed to providing highly accurate, official-source-verified information to empower job seekers in their career journey.
        </p>
        
        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-green-500 mx-auto rounded-full mt-6"></div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Articles by {decodedAuthorName} ({authorPosts.length})</h2>
        {authorPosts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found for this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {authorPosts.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-48 md:h-64 bg-gradient-to-br ${item.imgGradient || 'from-gray-700 to-gray-900'} flex flex-col justify-center items-center text-center overflow-hidden`}>
                    {item.featuredImage ? (
                      <>
                        <img src={item.featuredImage} alt={item.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-0"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-0"></div>
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl z-0"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl z-0"></div>
                      </>
                    )}
                    
                    {/* Tag */}
                    {item.tag && (
                      <div className={`absolute top-4 right-4 ${item.tagColor || 'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10 shadow-sm`}>
                        {item.tag}
                      </div>
                    )}
                    
                    {/* Mock content for the thumbnail */}
                    {!item.featuredImage && (
                      <div className="relative z-10 max-w-[80%] p-6">
                        <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight mb-2 uppercase">
                          {item.tag || 'Updates'}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-sm">
                          {(item.title || '').substring(0, 45)}...
                        </p>
                        <Link to={`/post/${item.id}`} className="mt-4 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-yellow-300 transition-colors">
                          Click Here!!!
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Link to={`/post/${item.id}`}>{item.title}</Link>
                    </h2>
                    
                    <div className="mt-auto">
                      <Link to={`/post/${item.id}`} className="inline-block text-green-600 dark:text-green-500 font-semibold text-sm uppercase tracking-wider mb-4 hover:text-green-700 dark:hover:text-green-400">
                        READ MORE »
                      </Link>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <span>{item.date && !isNaN(new Date(item.date).getTime()) ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
