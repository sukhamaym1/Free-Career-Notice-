import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  FileEdit, Trash2, Search, Filter, 
  MoreVertical, FileText, CheckCircle2, Clock
} from 'lucide-react';

interface PostsPageProps {
  rawPosts: any[];
  categories: any[];
  setActiveTab: (tab: string) => void;
  setEditingPost: (post: any) => void;
  handleDeletePost: (post: any) => void;
  currentFilter: 'All' | 'Posts' | 'All Posts' | 'Published' | 'Drafts' | 'Scheduled' | 'Trash';
}

export default function PostsPage({ 
  rawPosts, 
  categories, 
  setActiveTab, 
  setEditingPost,
  handleDeletePost,
  currentFilter
}: PostsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  let filteredPosts = rawPosts;

  // Apply current filter tab
  if (currentFilter === 'Published') {
    filteredPosts = filteredPosts.filter(p => p.status !== 'draft' && new Date(p.date) <= new Date());
  } else if (currentFilter === 'Drafts') {
    filteredPosts = filteredPosts.filter(p => p.status === 'draft' || p.draft === true);
  } else if (currentFilter === 'Scheduled') {
    filteredPosts = filteredPosts.filter(p => p.status !== 'draft' && new Date(p.date) > new Date());
  } else if (currentFilter === 'Trash') {
    // In a real app we'd have a trash status
    filteredPosts = []; 
  }

  // Apply search query
  if (searchQuery) {
    filteredPosts = filteredPosts.filter(p => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply category filter
  if (categoryFilter) {
    filteredPosts = filteredPosts.filter(p => p.categorySlug === categoryFilter);
  }

  const getStatusBadge = (post: any) => {
    const isDraft = post.status === 'draft' || post.draft;
    const isScheduled = !isDraft && post.date && new Date(post.date) > new Date();

    if (isDraft) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
          <FileEdit className="w-3.5 h-3.5" />
          Draft
        </span>
      );
    }
    
    if (isScheduled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
          <Clock className="w-3.5 h-3.5" />
          Scheduled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Published
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentFilter} Posts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your website's content.</p>
        </div>
        <button 
          onClick={() => { setEditingPost(null); setActiveTab('Create Post'); }} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Create New Post
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search posts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 w-full sm:w-64 transition-all"
              />
            </div>
            <button className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm font-medium">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.length > 0 ? categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              )) : (
                <>
                  <option value="job-notifications">Job Notifications</option>
                  <option value="admit-cards">Admit Cards</option>
                  <option value="results">Results</option>
                  <option value="highlight-updates">Highlight Updates</option>
                </>
              )}
            </select>
            
            <button className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="py-4 px-6 text-center">
                    <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white line-clamp-1">{post.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{post.id || post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(post)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {post.category || post.categorySlug || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(post.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button 
                        onClick={() => { setEditingPost(post); setActiveTab('Create Post'); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Edit"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        title="Trash"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium text-slate-900 dark:text-white">No posts found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                      <button 
                        onClick={() => { setEditingPost(null); setActiveTab('Create Post'); }} 
                        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Create your first post
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {filteredPosts.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">{filteredPosts.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredPosts.length}</span> results
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
