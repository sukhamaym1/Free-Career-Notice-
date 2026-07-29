import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useData } from '../components/DataProvider';

export default function SitemapPage() {
  const { PUBLISHED_POSTS, STATIC_PAGES } = useData();

  // Group posts by category
  const categoriesMap = new Map<string, any[]>();
  
  if (PUBLISHED_POSTS) {
    PUBLISHED_POSTS.forEach((post) => {
      const slug = post.categorySlug || 'uncategorized';
      if (!categoriesMap.has(slug)) {
        categoriesMap.set(slug, []);
      }
      categoriesMap.get(slug)!.push(post);
    });
  }

  const categoryEntries = Array.from(categoriesMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const staticPageIds = STATIC_PAGES ? Object.keys(STATIC_PAGES).sort() : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Sitemap - Free Career Notice</title>
        <meta name="description" content="Visual sitemap of all jobs, results, admit cards, and pages on Free Career Notice." />
      </Helmet>
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Sitemap</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of all content available on our site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Main Pages Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-2">
            Main Navigation
          </h2>
          <ul className="space-y-3 flex-grow">
            <li className="text-sm">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Home</Link>
            </li>
            <li className="text-sm">
              <Link to="/search" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Search</Link>
            </li>
            <li className="text-sm">
              <Link to="/quiz" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Quiz</Link>
            </li>
            {staticPageIds.map(pageId => (
              <li key={pageId} className="text-sm">
                <Link 
                  to={`/${pageId}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize font-medium line-clamp-1"
                >
                  {pageId.replace(/-/g, ' ')}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Section */}
        {categoryEntries.map(([slug, posts]) => (
          <div key={slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-2 capitalize">
              <Link to={`/category/${slug}`} className="hover:underline">
                {slug.replace(/-/g, ' ')}
              </Link>
            </h2>
            <ul className="space-y-3 flex-grow">
              {posts.map(post => (
                <li key={post.id} className="text-sm">
                  <Link 
                    to={`/post/${post.id}`}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-relaxed"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
}
