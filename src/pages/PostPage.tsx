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
      <main className="container mx-auto px-4 py-8 pb-20 animate-in fade-in duration-500 max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link to={`/category/${post.categorySlug}`} className="hover:text-blue-600 dark:hover:text-blue-400">{post.category}</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-gray-900 dark:text-gray-200 font-medium truncate">{post.title.substring(0, 40)}...</span>
      </nav>

      <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Featured Header Area */}
        <div className={`relative h-64 md:h-[400px] bg-gradient-to-br ${post.imgGradient} p-8 flex flex-col justify-end overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              {post.category}
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm md:text-base font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          </div>
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            {/* Share Widget */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5" />
                Share this Post
              </h3>
              <div className="flex gap-2 mb-3">
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#1877F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1877F2]/90 transition-colors" title="Share on Facebook">
                  <Facebook className="w-5 h-5" />
                </button>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#1DA1F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1DA1F2]/90 transition-colors" title="Share on Twitter">
                  <Twitter className="w-5 h-5" />
                </button>
                <button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#0A66C2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#0A66C2]/90 transition-colors" title="Share on LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 p-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy Share Link
              </button>
            </div>

            {/* Tags */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link key={tag} to={`/search?q=${tag}`} className="px-3 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
    </>
  );
}
