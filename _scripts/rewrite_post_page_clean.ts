import fs from 'fs';

const content = `import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_POSTS } from '../data';
import { 
  Calendar, User, Clock, Facebook, Twitter, Linkedin, 
  ChevronRight, Copy, Tag, Eye, ArrowLeft, ChevronDown
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';

// Custom icons for WhatsApp and Telegram
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#0088cc" opacity="0.1" />
    <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972c.321-1.428-.535-2.062-1.516-1.698L2.096 10.053c-1.393.551-1.378 1.328-.242 1.674l5.228 1.624 12.115-7.59c.572-.379 1.096-.172.664.212l-10.444 9.208Z" />
  </svg>
);

export default function PostPage() {
  const { postId } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [headings, setHeadings] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));
      const parsedHeadings = elements.map((el, index) => {
        if (!el.id) {
          el.id = \`heading-\${index}\`;
        }
        return {
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3
        };
      });
      setHeadings(parsedHeadings);
    }
  }, [postId]);

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
      setIsMobileTocOpen(false);
    }
  };

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
    date: new Date().toISOString(),
    author: "Admin",
    readTime: "0 min read",
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
      "item": \`\${window.location.origin}/category/\${post.categorySlug}\`
    },{
      "@type": "ListItem",
      "position": 3,
      "name": post.title
    }]
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
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 origin-left z-[100]" 
        style={{ scaleX }} 
      />
      
      <main className="bg-white dark:bg-[#0B1120] min-h-screen pb-24 font-sans text-slate-900 dark:text-slate-100">
        
        {/* Floating Share Bar - Desktop (Kept for functionality but can be made cleaner or moved to bottom of article) */}
        <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-40 bg-white dark:bg-slate-900 p-3 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
          <button onClick={() => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(postUrl)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[#1877F2] transition-colors" title="Share on Facebook">
            <Facebook className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[#1DA1F2] transition-colors" title="Share on Twitter">
            <Twitter className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(postUrl)}&title=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0A66C2] transition-colors" title="Share on LinkedIn">
            <Linkedin className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://api.whatsapp.com/send?text=\${encodeURIComponent(post.title + ' ' + postUrl)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[#25D366] transition-colors" title="Share on WhatsApp">
            <WhatsAppIcon className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://t.me/share/url?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0088cc] transition-colors" title="Share on Telegram">
            <TelegramIcon className="w-5 h-5" />
          </button>
          <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-700 mx-auto my-1"></div>
          <button onClick={copyToClipboard} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-blue-600 transition-colors" title="Copy Link">
            <Copy className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 md:px-8 xl:px-0 pt-8 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
            <Link to={\`/category/\${post.categorySlug}\`} className="hover:text-blue-600 transition-colors">{post.category}</Link>
            <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
            <span className="text-slate-900 dark:text-slate-200 truncate">{post.title.substring(0, 40)}...</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start relative">
            
            {/* Sidebar TOC - Desktop */}
            <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-24">
              {headings.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Table of Contents</h3>
                  <nav className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={\`text-left text-sm transition-all duration-200 leading-snug flex items-start gap-2 \${
                          activeHeading === heading.id 
                            ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        } \${heading.level === 3 ? 'pl-4' : ''}\`}
                      >
                        {activeHeading === heading.id && <div className="w-1 h-4 bg-blue-600 rounded-full shrink-0 mt-0.5"></div>}
                        <span className={activeHeading === heading.id ? '' : heading.level === 2 ? 'ml-3' : ''}>{heading.text}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </aside>

            {/* Main Article Content */}
            <article className="flex-1 max-w-[760px] w-full min-w-0">
              
              {/* Header */}
              <header className="mb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight mb-6">
                  {post.title}
                </h1>
                
                {displayDescription !== post.title && (
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-normal">
                    {displayDescription}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 text-sm font-medium border-y border-slate-100 dark:border-slate-800 py-4 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-200">{post.author}</span>
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
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>1.2k Views</span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="w-full aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-10 shadow-sm">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              )}

              {/* Mobile TOC Collapsible */}
              {headings.length > 0 && (
                <div className="lg:hidden mb-10 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                    className="w-full flex items-center justify-between p-5 font-bold text-slate-900 dark:text-white"
                  >
                    <span>Table of Contents</span>
                    <ChevronDown className={\`w-5 h-5 transition-transform duration-300 \${isMobileTocOpen ? 'rotate-180' : ''}\`} />
                  </button>
                  <AnimatePresence>
                    {isMobileTocOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <nav className="flex flex-col gap-3 p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 pt-4">
                          {headings.map((heading) => (
                            <button
                              key={heading.id}
                              onClick={() => scrollToHeading(heading.id)}
                              className={\`text-left text-sm transition-colors duration-200 leading-snug \${
                                activeHeading === heading.id 
                                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                  : 'text-slate-600 dark:text-slate-400'
                              } \${heading.level === 3 ? 'pl-4' : ''}\`}
                            >
                              {heading.text}
                            </button>
                          ))}
                        </nav>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Article Content */}
              <div 
                ref={contentRef}
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:bg-white dark:prose-h2:bg-slate-900 prose-h2:py-3 prose-h2:px-5 prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:rounded-r-lg prose-h2:shadow-sm prose-h2:border-t prose-h2:border-r prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:my-8
                prose-p:text-slate-800 dark:prose-p:text-slate-200 prose-p:leading-[1.8] prose-p:mb-6
                prose-li:text-slate-800 dark:prose-li:text-slate-200 prose-li:marker:text-blue-500
                prose-blockquote:border-l-4 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-700 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-blockquote:font-normal
                prose-table:w-full prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800
                prose-th:bg-slate-50 dark:prose-th:bg-slate-900 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900 dark:prose-th:text-slate-100
                prose-td:p-4 prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-slate-800"
                dangerouslySetInnerHTML={{ __html: post.content || '' }} 
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Related Topics</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link 
                        key={tag} 
                        to={\`/search?q=\${tag}\`} 
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </article>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900/50 py-16 mt-12 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 xl:px-0">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">More in {post.category}</h2>
                <Link to={\`/category/\${post.categorySlug}\`} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  View all
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: any, idx: number) => (
                  <motion.div
                    key={relatedPost.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link 
                      to={\`/post/\${relatedPost.id}\`}
                      className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/60 dark:border-slate-800 transition-all duration-300 h-full"
                    >
                      <div className={\`aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden\`}>
                        {relatedPost.featuredImage ? (
                          <img src={relatedPost.featuredImage} alt={relatedPost.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                            <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 uppercase tracking-wider">{relatedPost.category}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {relatedPost.title}
                        </h3>
                        <div className="mt-auto flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          {relatedPost.readTime && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                              <span>{relatedPost.readTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sticky Share Bar */}
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 p-4 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-center sm:justify-between max-w-md mx-auto">
            <span className="text-sm font-bold text-slate-900 dark:text-white hidden sm:block">Share this article</span>
            <div className="flex items-center gap-3">
              <button onClick={() => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(postUrl)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-white hover:bg-[#1877F2] transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button onClick={() => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-white hover:bg-[#1DA1F2] transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button onClick={() => window.open(\`https://api.whatsapp.com/send?text=\${encodeURIComponent(post.title + ' ' + postUrl)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-white hover:bg-[#25D366] transition-colors">
                <WhatsAppIcon className="w-4 h-4" />
              </button>
              <button onClick={() => window.open(\`https://t.me/share/url?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-white hover:bg-[#0088cc] transition-colors">
                <TelegramIcon className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
              <button onClick={copyToClipboard} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
`;
fs.writeFileSync('src/pages/PostPage.tsx', content);
