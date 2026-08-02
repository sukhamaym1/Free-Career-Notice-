import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, FileText, Download, Filter, Search, TrendingUp, Eye, X, Sparkles, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';

const SEARCH_PLACEHOLDERS = [
  "Search for PDF notes...",
  "Search for UPSC notes...",
  "Search for SSC notes...",
  "Search for Railway notes...",
  "Search for Banking notes...",
  "Search by topics or subjects..."
];

import { getCategoryBadgeStyle } from '../data/studyMaterials';
import { useData } from '../components/DataProvider';

const CATEGORIES = ['All', 'UPSC', 'SSC', 'Banking', 'Railway', 'Current Affairs', 'English'];

const parseDownloads = (downloads: string) => {
  const numStr = downloads.replace(/[^0-9.]/g, '');
  let num = parseFloat(numStr);
  if (downloads.toLowerCase().includes('k')) {
    num *= 1000;
  }
  return isNaN(num) ? 0 : num;
};

const isRecent = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays <= 7;
};

export default function StudyMaterialPage() {
  const { STUDY_MATERIALS } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewMaterial, setPreviewMaterial] = useState<any | null>(null);
  const [stats, setStats] = useState<{views: Record<string, number>, downloads: Record<string, number>}>({ views: {}, downloads: {} });
  const placeholder = useTypingPlaceholder(SEARCH_PLACEHOLDERS);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.views || data.downloads) {
          setStats({
            views: data.views || {},
            downloads: data.downloads || {}
          });
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const getDownloads = (item: any) => {
    const key = `material-${item.id}`;
    return stats.downloads[key] > 0 ? stats.downloads[key].toLocaleString() : item.downloads;
  };

  const filteredMaterials = STUDY_MATERIALS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const topMaterials = [...STUDY_MATERIALS]
    .sort((a, b) => {
      const aDownloads = stats.downloads[`material-${a.id}`] || parseDownloads(a.downloads);
      const bDownloads = stats.downloads[`material-${b.id}`] || parseDownloads(b.downloads);
      return bDownloads - aDownloads;
    })
    .slice(0, 5);


  return (
    <>
      <Helmet>
        <title>Study Material & PDFs - Free Career Notice</title>
        <meta name="description" content="Download free study material, PDF notes, previous year papers, and current affairs for SSC, UPSC, Banking, and Railway exams." />
      </Helmet>
      
      <main className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-24">
        {/* Header Section */}
        <div className="bg-[#0a0f1c] pt-16 pb-20 w-full border-b border-slate-800 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Free Resources</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Materials</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Download high-quality PDF notes, previous year papers, and syllabus for all competitive exams.
            </p>
            
            <div className="max-w-xl mx-auto relative group">
              <input 
                type="text" 
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg backdrop-blur-sm"
              />
              <Search className="absolute left-5 top-0 bottom-0 my-auto w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 -mt-8 relative z-20">
          
          {/* Most Popular Materials */}
          {searchQuery === '' && activeCategory === 'All' && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Most Popular Materials</h2>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x">
                {topMaterials.map((item) => (
                  <Link 
                    to={`/study-material/${item.id}`} 
                    key={`popular-${item.id}`}
                    className="shrink-0 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col snap-start"
                  >
                    <div className={`h-24 bg-gradient-to-br ${item.color} relative overflow-hidden p-4 flex flex-col justify-end`}>
                      {isRecent(item.date) && (
                        <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-lg flex items-center gap-1 z-10 ${item.isUpdated ? 'bg-blue-500' : 'bg-green-500'}`}>
                          {item.isUpdated ? <RefreshCw className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          {item.isUpdated ? 'Updated' : 'New'}
                        </div>
                      )}
                      <div className="absolute top-0 right-0 p-3 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                        <FileText className="w-16 h-16" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPreviewMaterial(item);
                          }}
                          className="bg-white/90 text-slate-900 px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 hover:bg-white hover:scale-105 transition-all shadow-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Quick View
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className={`inline-flex max-w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${getCategoryBadgeStyle(item.category)}`}>
                        {item.category}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{item.pages} pgs</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400">
                          <Download className="w-3.5 h-3.5" />
                          <span>{getDownloads(item)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mr-2 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">Filter:</span>
            </div>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeCategory === category 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Showing {filteredMaterials.length} PDFs
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMaterials.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col h-full"
                >
                  <div className={`h-32 bg-gradient-to-br ${item.color} relative overflow-hidden p-6 flex flex-col justify-end`}>
                    {isRecent(item.date) && (
                      <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-lg flex items-center gap-1 z-10 ${item.isUpdated ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {item.isUpdated ? <RefreshCw className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {item.isUpdated ? 'Updated' : 'New'}
                      </div>
                    )}
                    <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                      <FileText className="w-24 h-24" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setPreviewMaterial(item);
                        }}
                        className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className={`inline-flex max-w-fit px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-3 ${getCategoryBadgeStyle(item.category)}`}>
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Link to={`/study-material/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{item.pages} Pages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Size:</span>
                        <span>{item.fileSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>{getDownloads(item)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.fileUrl) {
                            window.open(item.fileUrl, '_blank');
                          } else {
                            const event = new CustomEvent('show-toast', { detail: { message: `Downloading ${item.title}...` }});
                            document.dispatchEvent(event);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredMaterials.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No materials found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query or changing the category filter.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick View Modal */}
        <AnimatePresence>
          {previewMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setPreviewMaterial(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200 dark:border-slate-800"
              >
                {/* Simulated PDF First Page */}
                <div className={`md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-br ${previewMaterial.color} text-white relative min-h-[400px]`}>
                  <div className="absolute top-4 right-4 opacity-10">
                    <FileText className="w-48 h-48" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-xl w-full max-w-sm aspect-[1/1.4] shadow-2xl flex flex-col relative z-10">
                    <div className="text-center mb-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                        {previewMaterial.category}
                      </div>
                      <h3 className="text-2xl font-bold leading-tight mb-2">{previewMaterial.title}</h3>
                      <div className="text-white/70 text-sm font-medium">By {previewMaterial.author}</div>
                    </div>
                    
                    <div className="flex-1 border-t border-white/20 pt-4 mt-2">
                      <div className="space-y-3 opacity-60">
                        <div className="h-2 bg-white/40 rounded w-full"></div>
                        <div className="h-2 bg-white/40 rounded w-5/6"></div>
                        <div className="h-2 bg-white/40 rounded w-4/6"></div>
                        <div className="h-2 bg-white/40 rounded w-full"></div>
                        <div className="h-2 bg-white/40 rounded w-3/4"></div>
                        <div className="h-2 bg-white/40 rounded w-5/6"></div>
                      </div>
                    </div>
                    <div className="mt-auto text-center text-xs opacity-60 font-medium">Page 1 of {previewMaterial.pages}</div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-6 md:p-10 flex flex-col bg-slate-50 dark:bg-slate-900 relative">
                  <button 
                    onClick={() => setPreviewMaterial(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="mt-4 flex-1">
                    <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-4 ${getCategoryBadgeStyle(previewMaterial.category)}`}>
                      {previewMaterial.category}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{previewMaterial.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                      {previewMaterial.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">File Size</div>
                        <div className="font-bold text-slate-900 dark:text-white">{previewMaterial.fileSize}</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Downloads</div>
                        <div className="font-bold text-slate-900 dark:text-white">{getDownloads(previewMaterial)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <Link 
                      to={`/study-material/${previewMaterial.id}`}
                      className="flex-1 flex items-center justify-center py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      View Full Details
                    </Link>
                    <button 
                      onClick={() => {
                        if (previewMaterial.fileUrl) {
                          window.open(previewMaterial.fileUrl, '_blank');
                        } else {
                          const event = new CustomEvent('show-toast', { detail: { message: `Downloading ${previewMaterial.title}...` }});
                          document.dispatchEvent(event);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
