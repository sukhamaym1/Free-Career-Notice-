import { useParams, Link } from 'react-router-dom';
import { ALL_POSTS } from '../data';
import { Calendar, User, Clock, Share2, Facebook, Twitter, ChevronRight, FileText, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

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
  

  return (
    <>
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
                <span>{post.date}</span>
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
                <button className="flex-1 bg-[#1877F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1877F2]/90 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="flex-1 bg-[#1DA1F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1DA1F2]/90 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="flex-1 bg-[#25D366] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#25D366]/90 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
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
