import { useParams, Link } from 'react-router-dom';
import { ALL_POSTS } from '../data';
import { Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, ChevronRight, FileText, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function PostPage() {
  const { postId } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      document.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: 'Link copied to clipboard!' }
      }));
    });
  };

  const foundPost = ALL_POSTS.find((p: any) => p.id === postId);
  
  const post = foundPost || {
    title: "Post Not Found",
    category: "Unknown",
    categorySlug: "unknown",
    date: "",
    author: "",
    readTime: "",
    imgGradient: "from-blue-600 to-indigo-800",
    tags: [],
    content: "<p>The requested post could not be found.</p>"
  };
  
  const categoryName = post.categorySlug ? post.categorySlug.split('-').map((s:string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : post.category || '';
  post.category = categoryName;
  

  const displayTitle = post.seoTitle || `${post.title} - Career Notice`;
  const displayDescription = post.seoDescription || post.title;
  const displayImage = post.featuredImage || (window.location.origin + '/default-og.jpg');
  const postUrl = window.location.href;
  
  const relatedPosts = ALL_POSTS
    .filter((p: any) => p.categorySlug === post.categorySlug && p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{displayTitle}</title>
        <meta name="description" content={displayDescription} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayDescription} />
        <meta property="og:image" content={displayImage} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayDescription} />
        <meta name="twitter:image" content={displayImage} />
      </Helmet>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]" 
        style={{ scaleX }} 
      />
      <main className="animate-in fade-in duration-500 pb-20">
      <article>
        {/* Featured Header Area - Full bleed */}
        <div className={`relative w-full h-[40vh] min-h-[320px] max-h-[500px] bg-gradient-to-br ${post.imgGradient || 'from-blue-600 to-indigo-800'} flex flex-col justify-end overflow-hidden`}>
          {post.featuredImage ? (
            <>
              <img src={post.featuredImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-0"></div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/20 z-0"></div>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl z-0"></div>
            </>
          )}
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10 pb-12">
            <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4 shadow-sm">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-md max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm md:text-base font-medium">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-blue-300" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-blue-300" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-blue-300" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl -mt-6 relative z-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-8 overflow-x-auto whitespace-nowrap pb-2 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</Link>
            <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
            <Link to={`/category/${post.categorySlug}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">{post.category}</Link>
            <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100 font-semibold truncate">{post.title.substring(0, 40)}...</span>
          </nav>

          {/* Content Area */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 lg:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 space-y-8">
              {/* Share Widget */}
              <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  Share this Post
                </h3>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#1877F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1877F2]/90 transition-colors shadow-sm" title="Share on Facebook">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#1DA1F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1DA1F2]/90 transition-colors shadow-sm" title="Share on Twitter">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#0A66C2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#0A66C2]/90 transition-colors shadow-sm" title="Share on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 p-2.5 rounded-lg border border-gray-200 dark:border-slate-600 transition-colors font-medium text-sm shadow-sm"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                  Copy Share Link
                </button>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag} to={`/search?q=${tag}`} className="px-3 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors shadow-sm">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <div className="container mx-auto px-4 max-w-5xl">
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <Link 
                key={relatedPost.id} 
                to={`/post/${relatedPost.id}`}
                className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all block"
              >
                <div className={`h-32 bg-gradient-to-br ${relatedPost.imgGradient || 'from-gray-700 to-gray-900'} relative overflow-hidden`}>
                  {relatedPost.featuredImage ? (
                    <>
                      <img src={relatedPost.featuredImage} alt={relatedPost.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-0"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-0"></div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded mb-2">
                      {relatedPost.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </main>
    </>
  );
}
