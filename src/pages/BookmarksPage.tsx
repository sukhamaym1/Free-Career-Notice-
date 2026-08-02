import { Bookmark } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useData } from '../components/DataProvider';
import { useBookmarks } from '../hooks/useBookmarks';
import ListSection from '../components/ListSection';

export default function BookmarksPage() {
  const { ALL_POSTS } = useData();
  const { bookmarks } = useBookmarks();

  const savedPosts = ALL_POSTS.filter((post: any) => bookmarks.includes(post.id));

  return (
    <>
      <Helmet>
        <title>Saved Jobs - Career Notice</title>
        <meta name="description" content="Your saved job notifications and opportunities." />
      </Helmet>
      
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <div className="bg-[#0a0f1c] pt-16 pb-20 w-full border-b border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 mb-6">
              <Bookmark className="w-8 h-8 text-blue-500" fill="currentColor" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Saved Jobs</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Access your bookmarked job posts and opportunities quickly.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8 relative z-10">
          {savedPosts.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <ListSection 
                title={`Saved Posts (${savedPosts.length})`}
                items={savedPosts} 
                viewAllLink="#"
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <Bookmark className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No saved jobs yet</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                You haven't bookmarked any jobs yet. Browse the latest notifications and save the ones you're interested in.
              </p>
              <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                Browse Jobs
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
