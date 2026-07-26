import fs from 'fs';
const content = `import { useParams, Link } from 'react-router-dom';
import { ALL_POSTS } from '../data';
import { Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, ChevronRight, Copy, Tag } from 'lucide-react';
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
    imgGradient: "from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900",
    tags: [],
    content: "<p>The requested post could not be found.</p>"
  };
  
  const categoryName = post.categorySlug ? post.categorySlug.split('-').map((s:string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : post.category || '';
  post.category = categoryName;
  
  const displayTitle = post.seoTitle || \`\${post.title} - Career Notice\`;
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
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 origin-left z-[60]" 
        style={{ scaleX }} 
      />
      
      <main className="animate-in fade-in duration-700 bg-gray-50 dark:bg-[#0B1120] min-h-screen pb-24">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 pt-8 pb-12">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
              <Link to={\`/category/\${post.categorySlug}\`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{post.category}</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
              <span className="text-gray-900 dark:text-gray-200 truncate">{post.title.substring(0, 40)}...</span>
            </nav>

            <div className="flex flex-col items-start gap-6">
              <Link 
                to={\`/category/\${post.categorySlug}\`}
                className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-full uppercase tracking-wider shadow-sm border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
              >
                {post.category}
              </Link>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{post.readTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
          {/* Featured Image */}
          <div className={\`w-full aspect-[21/9] min-h-[300px] md:min-h-[400px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br \${post.imgGradient || 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'} border-4 border-white dark:border-slate-800 relative\`}>
            {post.featuredImage ? (
              <img src={post.featuredImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-extrabold text-black/10 dark:text-white/10 uppercase tracking-widest">{post.category}</span>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl mt-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main Content Area */}
            <article className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white 
                prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 
                prose-img:rounded-2xl prose-img:shadow-md
                prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: post.content || '' }} 
              />
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
              {/* Share Widget */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Share this Post
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button onClick={() => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(postUrl)}\`, '_blank')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#1877F2]/10 hover:text-[#1877F2] text-slate-600 dark:text-slate-400 p-4 rounded-2xl transition-colors">
                    <Facebook className="w-6 h-6" />
                  </button>
                  <button onClick={() => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] text-slate-600 dark:text-slate-400 p-4 rounded-2xl transition-colors">
                    <Twitter className="w-6 h-6" />
                  </button>
                  <button onClick={() => window.open(\`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(postUrl)}&title=\${encodeURIComponent(post.title)}\`, '_blank')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] text-slate-600 dark:text-slate-400 p-4 rounded-2xl transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </button>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-colors font-semibold shadow-sm shadow-blue-500/20"
                >
                  <Copy className="w-5 h-5" />
                  Copy Link
                </button>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link key={tag} to={\`/search?q=\${tag}\`} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="container mx-auto px-4 max-w-5xl mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">More in {post.category}</h2>
              <Link to={\`/category/\${post.categorySlug}\`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Link 
                  key={relatedPost.id} 
                  to={\`/post/\${relatedPost.id}\`}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={\`aspect-[16/10] bg-gradient-to-br \${relatedPost.imgGradient || 'from-slate-100 to-slate-200'} relative overflow-hidden\`}>
                    {relatedPost.featuredImage && (
                      <img src={relatedPost.featuredImage} alt={relatedPost.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {relatedPost.title}
                    </h3>
                    <div className="mt-auto flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-4 h-4 mr-2 opacity-70" />
                      <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
`;
fs.writeFileSync('src/pages/PostPage.tsx', content);
