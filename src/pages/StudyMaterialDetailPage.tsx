import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Download, FileText, Calendar, Eye, Share2, Check, Loader2, Star, Search, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { getCategoryBadgeStyle } from '../data/studyMaterials';
import { useData } from '../components/DataProvider';

export default function StudyMaterialDetailPage() {
  const { STUDY_MATERIALS, loading } = useData();
  const { id } = useParams();
  const material = STUDY_MATERIALS.find((m: any) => m.id === id);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ views: 0, downloads: 0 });
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [pageSearchQuery, setPageSearchQuery] = useState('');

  const highlightText = (text: string) => {
    if (!pageSearchQuery.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${pageSearchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === pageSearchQuery.trim().toLowerCase() 
            ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/40 text-inherit rounded px-0.5">{part}</mark>
            : part
        )}
      </>
    );
  };

  useEffect(() => {
    if (material) {
      // Record a view when the page loads
      fetch(`/api/stats/material-${material.id}/view`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStats(prev => ({ ...prev, views: data.views }));
          }
        })
        .catch(err => console.error('Error tracking view:', err));
        
      // Fetch current stats to show
      fetch(`/api/stats/material-${material.id}`)
        .then(res => res.json())
        .then(data => {
          setStats({ views: data.views || 0, downloads: data.downloads || 0 });
        })
        .catch(err => console.error('Error fetching stats:', err));
    }
  }, [material]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading material details...</p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Material Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">The study material you are looking for doesn't exist.</p>
          <Link to="/study-material" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Study Materials
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/study-material/' + material.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = (itemId: string, itemTitle: string, fileUrl?: string) => {
    if (downloadingId) return;
    setDownloadingId(itemId);

    fetch(`/api/stats/material-${itemId}/download`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success && itemId === material.id) {
          setStats(prev => ({ ...prev, downloads: data.downloads }));
        }
      })
      .catch(err => console.error('Error tracking download:', err))
      .finally(() => {
        setTimeout(() => setDownloadingId(null), 1500);
      });

    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      const event = new CustomEvent('show-toast', { detail: { message: `Downloading ${itemTitle}...` }});
      document.dispatchEvent(event);
    }
  };

  return (
    <>
      <Helmet>
        <title>{material.title} - Free Career Notice</title>
        <meta name="description" content={material.description || `Download ${material.title} PDF notes.`} />
      </Helmet>
      
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
        <div className={`w-full pt-12 pb-24 bg-gradient-to-br ${material.color} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <FileText className="w-64 h-64 text-white" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/study-material" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to List
            </Link>
            
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-white/20 text-white backdrop-blur-md uppercase tracking-wider mb-4">
                {material.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {highlightText(material.title)}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(material.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span className="opacity-50">•</span>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{material.pages} Pages</span>
                </div>
                <span className="opacity-50">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="uppercase tracking-wider opacity-80 text-xs">Size:</span>
                  <span>{material.fileSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 -mt-12 relative z-20 mb-16">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 md:p-10 flex flex-col md:flex-row gap-10">
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About this Material</h2>
                <div className="relative w-full sm:w-64 shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search in text..."
                    value={pageSearchQuery}
                    onChange={(e) => setPageSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow dark:text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="prose dark:prose-invert prose-slate max-w-none mb-10">
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  {highlightText(material.description || `This is a comprehensive study material covering all important aspects of ${material.title}. It is specifically designed to help aspirants prepare effectively and quickly revise important concepts.`)}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mt-4">
                  {highlightText("Make sure to combine this with our mock tests and daily current affairs updates for the best preparation strategy. All the content provided here is strictly meant for educational purposes.")}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                <button
                  onClick={() => handleDownload(material.id, material.title, material.fileUrl)}
                  disabled={downloadingId === material.id}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    downloadingId === material.id 
                      ? 'bg-blue-400 dark:bg-blue-600/50 cursor-not-allowed text-white shadow-none'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5'
                  }`}
                >
                  {downloadingId === material.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Share Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-64 shrink-0 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Stats</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.views != null ? stats.views.toLocaleString() : '0'}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Downloads</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.downloads > 0 ? stats.downloads.toLocaleString() : (material.downloads || '0')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Rate this PDF</h3>
                <div className="flex flex-col items-center">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        disabled={hasRated}
                        onMouseEnter={() => !hasRated && setHoverRating(star)}
                        onMouseLeave={() => !hasRated && setHoverRating(0)}
                        onClick={() => {
                          if (!hasRated) {
                            setUserRating(star);
                            setHasRated(true);
                            const event = new CustomEvent('show-toast', { detail: { message: `Thank you for rating ${star} stars!` }});
                            document.dispatchEvent(event);
                          }
                        }}
                        className={`transition-all ${hasRated ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || userRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
                    {hasRated ? 'Thanks for your feedback!' : 'How helpful is this material?'}
                  </span>
                </div>
              </div>

              {/* Share Widget */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Share</h3>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(material.title + ' ' + window.location.origin + '/study-material/' + material.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/study-material/' + material.id)}&text=${encodeURIComponent(material.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/study-material/' + material.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Related Study Materials */}
        {(() => {
          let related = STUDY_MATERIALS.filter(m => m.id !== material.id && m.category === material.category).slice(0, 3);
          if (related.length === 0) {
            related = STUDY_MATERIALS.filter(m => m.id !== material.id).slice(0, 3);
          }
          
          if (related.length === 0) return null;

          return (
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Study Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col h-full"
                  >
                    <div className={`h-24 bg-gradient-to-br ${item.color} relative overflow-hidden p-4 flex flex-col justify-end`}>
                      <div className="absolute top-0 right-0 p-3 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                        <FileText className="w-16 h-16" />
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className={`inline-flex max-w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${getCategoryBadgeStyle(item.category)}`}>
                        {item.category}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link to={`/study-material/${item.id}`} className="hover:underline">
                          {item.title}
                        </Link>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4 mt-auto">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3" />
                          <span>{item.pages} Pages</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider">Size:</span>
                          <span>{item.fileSize}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(item.id, item.title, item.fileUrl);
                          }}
                          disabled={downloadingId === item.id}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-colors text-sm ${
                            downloadingId === item.id
                              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-400 cursor-not-allowed'
                              : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                          }`}
                        >
                          {downloadingId === item.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </main>
    </>
  );
}
