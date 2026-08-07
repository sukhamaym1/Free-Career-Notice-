import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../components/DataProvider';
import { 
  Calendar, User, Eye, ChevronRight, ChevronDown, List, Twitter, Facebook, Linkedin, Share2, Copy, Check
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function PostPage() {
  const { PUBLISHED_POSTS, ALL_POSTS } = useData();
  const { postId } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [headings, setHeadings] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const foundPost = ALL_POSTS.find((p: any) => p.id === postId);
  
  const post: any = foundPost || {
    title: "Post Not Found",
    category: "Unknown",
    categorySlug: "unknown",
    date: new Date().toISOString(),
    author: "Admin",
    readTime: "0 min read",
    imgGradient: "from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900",
    tags: [],
    content: "<p>The requested post could not be found.</p>"
  };
  
  const categoryName = post.categorySlug ? post.categorySlug.split('-').map((s:string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : post.category || '';
  post.category = categoryName;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

  useEffect(() => {
    if (contentRef.current) {
      const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));
      const parsedHeadings = elements.map((el, index) => {
        if (!el.id) {
          el.id = `heading-${index}`;
        }
        return {
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3
        };
      });
      setHeadings(parsedHeadings);
    }
  }, [postId, post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveHeading(el.id);
          return;
        }
      }
      if (headings.length > 0) setActiveHeading(headings[0].id);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  
  const displayTitle = post.seoTitle || `${post.title} - Career Notice`;
  const displayDescription = post.seoDescription || post.title;
  const displayImage = post.featuredImage || (window.location.origin + '/default-og.jpg');
  const postUrl = window.location.href;
  
  // SEO Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [displayImage],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
        "@type": "Person",
        "name": post.author,
        "url": window.location.origin
      }],
    "publisher": {
      "@type": "Organization",
      "name": "Career Notice",
      "logo": {
        "@type": "ImageObject",
        "url": window.location.origin + "/logo.png"
      }
    },
    "description": displayDescription
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": window.location.origin
    },{
      "@type": "ListItem",
      "position": 2,
      "name": post.category,
      "item": `${window.location.origin}/category/${post.categorySlug}`
    },{
      "@type": "ListItem",
      "position": 3,
      "name": post.title
    }]
  };

  const relatedPosts = PUBLISHED_POSTS
    .filter((p: any) => (p.categorySlug === post.categorySlug || (post.tags && Array.isArray(post.tags) && p.tags && Array.isArray(p.tags) && post.tags.some((tag: string) => p.tags.includes(tag)))) && p.id !== post.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/post/' + post.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>{displayTitle}</title>
        <meta name="description" content={displayDescription} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayDescription} />
        <meta property="og:image" content={displayImage} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags && post.tags.map((tag: string) => (
            <meta property="article:tag" content={tag} key={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayDescription} />
        <meta name="twitter:image" content={displayImage} />
        
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]" 
        style={{ scaleX }} 
      />
      
      <main className="bg-white dark:bg-[#0B1120] min-h-screen pb-24 font-sans text-slate-900 dark:text-slate-100">
        
        {/* Header Section matching screenshot */}
        <div className="bg-[#0a0f1c] pt-12 pb-8 w-full border-b border-slate-800">
          <div className="max-w-[1000px] mx-auto px-4 md:px-8">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
              <Link to={`/category/${post.categorySlug}`} className="hover:text-white transition-colors">{post.category}</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
              <span className="text-slate-200 truncate">{post.title.substring(0, 40)}...</span>
            </nav>

            <h1 className="text-3xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.15] tracking-tight mb-8">
              {post.title}
            </h1>
            
            <div className="border-t border-slate-800 pt-6 flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium">
              <Link to={`/author/${encodeURIComponent(post.author || 'Editor')}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <User className="w-4 h-4" />
                <span className="text-slate-200 hover:text-blue-400">{post.author}</span>
              </Link>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date && !isNaN(new Date(post.date).getTime()) ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>1.2k Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-[800px] mx-auto px-4 md:px-8 pt-12 pb-16">
          <article className="w-full">
            
            {/* Featured Image inside content (if exists) */}
            {post.featuredImage && (
              <div className="w-full aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-200 dark:border-slate-800">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  loading="lazy"
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            {/* TOC Dropdown - Desktop & Mobile */}
            {headings.length > 0 && (
              <div className="mb-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button 
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className="w-full flex items-center justify-between p-4 md:p-5 font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Table of Contents</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isTocOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isTocOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <nav className="flex flex-col gap-2 p-4 md:p-5 pt-0 border-t border-slate-200 dark:border-slate-800 mt-1 max-h-[60vh] overflow-y-auto">
                        {headings.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={`text-left text-sm md:text-base transition-colors duration-200 leading-relaxed flex items-start gap-3 py-1 ${
                              activeHeading === heading.id 
                                ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            } ${heading.level === 3 ? 'pl-6' : ''}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${activeHeading === heading.id ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
                            <span>{heading.text}</span>
                          </button>
                        ))}
                      </nav>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Article Content - Clean & Minimal Typography */}
            <div 
              ref={contentRef}
              className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:bg-slate-50 dark:prose-h2:bg-slate-900 prose-h2:py-3 prose-h2:px-5 prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:rounded-r-lg prose-h2:border-t prose-h2:border-r prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800
              prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:my-8 prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800
              prose-p:text-slate-800 dark:prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:mb-6
              prose-li:text-slate-800 dark:prose-li:text-slate-300 prose-li:marker:text-blue-600
              prose-blockquote:border-l-4 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-700 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-blockquote:font-normal
              prose-table:w-full prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800
              prose-th:bg-slate-50 dark:prose-th:bg-slate-900 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900 dark:prose-th:text-slate-100
              prose-td:p-4 prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-slate-800"
              dangerouslySetInnerHTML={{ __html: post.content || '' }} 
            />

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag: string) => (
                    <Link 
                      key={tag} 
                      to={`/search?q=${tag}`} 
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* About the Author Section for E-E-A-T */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/50">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    About <Link to={`/author/${encodeURIComponent(post.author || 'Editor')}`} className="hover:text-blue-500 hover:underline transition-colors">{post.author || 'the Editor'}</Link>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-200 dark:border-blue-800/50 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Expert
                    </span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {post.author || 'Our Career Notice editorial team'} brings years of expertise in career counseling and government job notifications. We are committed to providing highly accurate, official-source-verified information to empower job seekers in their career journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">Share this post:</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/post/' + post.id)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/post/' + post.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2] hover:text-white transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/post/' + post.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                  
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                    aria-label="Copy link to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost: any) => (
                    <Link
                      key={relatedPost.id}
                      to={`/post/${relatedPost.id}`}
                      className="group flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      {relatedPost.featuredImage ? (
                        <div className="aspect-[16/9] w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                          <img
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className={`aspect-[16/9] w-full overflow-hidden relative bg-gradient-to-br ${relatedPost.imgGradient || 'from-blue-500 to-indigo-600'} flex items-center justify-center p-6 text-center`}>
                           <h4 className="text-white font-bold text-lg drop-shadow-md line-clamp-3">{relatedPost.title}</h4>
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {relatedPost.title}
                        </h4>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                           <div className="flex items-center gap-1.5">
                             <Calendar className="w-3.5 h-3.5" />
                             <span>
                               {relatedPost.date && !isNaN(new Date(relatedPost.date).getTime())
                                 ? new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                 : ''}
                             </span>
                           </div>
                           <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                             Read <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                           </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </article>
        </div>
      </main>
    </>
  );
}
