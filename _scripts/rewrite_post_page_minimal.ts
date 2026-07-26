import fs from 'fs';

const content = `import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_POSTS } from '../data';
import { 
  Calendar, User, Eye, ChevronRight, ChevronDown
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';

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
          el.id = \\\`heading-\\\${index}\\\`;
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
  
  const displayTitle = post.seoTitle || \\\`\\\${post.title} - Career Notice\\\`;
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
      "item": \\\`\\\${window.location.origin}/category/\\\${post.categorySlug}\\\`
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
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]" 
        style={{ scaleX }} 
      />
      
      <main className="bg-white dark:bg-[#0B1120] min-h-screen pb-24 font-sans text-slate-900 dark:text-slate-100">
        
        {/* Header Section matching screenshot */}
        <div className="bg-[#0a0f1c] pt-12 pb-8 w-full border-b border-slate-800">
          <div className="max-w-[1100px] mx-auto px-4 md:px-8 xl:px-0">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
              <Link to={\`/category/\\\${post.categorySlug}\`} className="hover:text-white transition-colors">{post.category}</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
              <span className="text-slate-200 truncate">{post.title.substring(0, 40)}...</span>
            </nav>

            <h1 className="text-3xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.15] tracking-tight mb-8">
              {post.title}
            </h1>
            
            <div className="border-t border-slate-800 pt-6 flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-slate-200">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>1.2k Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 xl:px-0 pt-12 pb-16">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start relative">
            
            {/* Sidebar TOC - Desktop */}
            <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-10">
              {headings.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Table of Contents</h3>
                  <nav className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={\`text-left text-sm transition-all duration-200 leading-snug flex items-start gap-2 \\\${
                          activeHeading === heading.id 
                            ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        } \\\${heading.level === 3 ? 'pl-4' : ''}\\\`}
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

              {/* Mobile TOC Collapsible */}
              {headings.length > 0 && (
                <div className="lg:hidden mb-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                    className="w-full flex items-center justify-between p-5 font-bold text-slate-900 dark:text-white"
                  >
                    <span>Table of Contents</span>
                    <ChevronDown className={\`w-5 h-5 transition-transform duration-300 \\\${isMobileTocOpen ? 'rotate-180' : ''}\\\`} />
                  </button>
                  <AnimatePresence>
                    {isMobileTocOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <nav className="flex flex-col gap-3 p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 pt-4 max-h-[50vh] overflow-y-auto">
                          {headings.map((heading) => (
                            <button
                              key={heading.id}
                              onClick={() => scrollToHeading(heading.id)}
                              className={\`text-left text-sm transition-colors duration-200 leading-snug flex items-start gap-2 \\\${
                                activeHeading === heading.id 
                                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                                  : 'text-slate-600 dark:text-slate-400'
                              } \\\${heading.level === 3 ? 'pl-4' : ''}\\\`}
                            >
                              {activeHeading === heading.id && <div className="w-1 h-4 bg-blue-600 rounded-full shrink-0 mt-0.5"></div>}
                              <span className={activeHeading === heading.id ? '' : heading.level === 2 ? 'ml-3' : ''}>{heading.text}</span>
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
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:bg-white dark:prose-h2:bg-slate-900 prose-h2:py-3 prose-h2:px-5 prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:rounded-r-lg prose-h2:shadow-sm prose-h2:border-t prose-h2:border-r prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
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
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
`;
fs.writeFileSync('src/pages/PostPage.tsx', content);
