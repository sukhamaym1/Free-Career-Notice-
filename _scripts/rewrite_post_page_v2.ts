import fs from 'fs';

const content = `import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_POSTS } from '../data';
import { 
  Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, 
  ChevronRight, Copy, Tag, Eye, ArrowLeft, Mail, Send, MessageCircle
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
    
  const popularPosts = ALL_POSTS
    .filter((p: any) => p.id !== post.id)
    .slice(0, 4);

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
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 origin-left z-[100]" 
        style={{ scaleX }} 
      />
      
      <main className="animate-in fade-in duration-700 bg-[#F9FAFB] dark:bg-[#0B1120] min-h-screen pb-24 font-sans">
        
        {/* Floating Share Bar - Desktop */}
        <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-full border border-slate-200/60 dark:border-slate-800 shadow-2xl">
          <button onClick={() => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(postUrl)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-[#1877F2] transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/40" title="Share on Facebook">
            <Facebook className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-[#1DA1F2] transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#1DA1F2]/40" title="Share on Twitter">
            <Twitter className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(postUrl)}&title=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-[#0A66C2] transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#0A66C2]/40" title="Share on LinkedIn">
            <Linkedin className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://api.whatsapp.com/send?text=\${encodeURIComponent(post.title + ' ' + postUrl)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-[#25D366] transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#25D366]/40" title="Share on WhatsApp">
            <WhatsAppIcon className="w-5 h-5" />
          </button>
          <button onClick={() => window.open(\`https://t.me/share/url?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank')} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-[#0088cc] transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#0088cc]/40" title="Share on Telegram">
            <TelegramIcon className="w-5 h-5" />
          </button>
          <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-700 mx-auto my-1"></div>
          <button onClick={copyToClipboard} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all hover:scale-110" title="Copy Link">
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section */}
        <section className="w-full bg-slate-900 relative overflow-hidden pt-24 pb-32">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            {post.featuredImage ? (
              <>
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover opacity-40 blur-sm scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
              </>
            ) : (
              <div className={\`w-full h-full bg-gradient-to-br \${post.imgGradient || 'from-blue-900 to-indigo-900'} opacity-60\`}></div>
            )}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-300 mb-8 font-medium bg-white/5 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/10">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
              <Link to={\`/category/\${post.categorySlug}\`} className="hover:text-white transition-colors">{post.category}</Link>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
              <span className="text-white truncate max-w-[200px] sm:max-w-[300px]">{post.title}</span>
            </nav>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <Link 
                to={\`/category/\${post.categorySlug}\`}
                className="inline-flex items-center px-4 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-bold rounded-full uppercase tracking-wider border border-blue-400/30 hover:bg-blue-500/30 transition-colors mb-6 backdrop-blur-md"
              >
                {post.category}
              </Link>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
                {post.title}
              </h1>
              
              {displayDescription !== post.title && (
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed font-light">
                  {displayDescription}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-slate-300 text-sm md:text-base font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white border-2 border-white/20 shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{post.author}</div>
                    <div className="text-xs text-slate-400">Author</div>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-white/20 hidden md:block"></div>
                
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                {post.readTime && (
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{post.readTime}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>1.2k Views</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image - 21:9 */}
        {post.featuredImage && (
          <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-20 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group"
            >
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </motion.div>
          </div>
        )}

        <div className={\`container mx-auto px-4 max-w-6xl \${!post.featuredImage ? 'mt-12' : ''}\`}>
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
            
            {/* Main Content Area */}
            <div className="flex-1 lg:max-w-[760px] min-w-0">
              
              {/* Article Content */}
              <article 
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/60 dark:border-slate-800 mb-12 relative overflow-hidden"
              >
                {/* Decorative Blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div 
                  ref={contentRef}
                  className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                  prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white 
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800 prose-h2:pb-4
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-10
                  prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:marker:text-blue-500
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200 prose-blockquote:font-medium
                  prose-table:overflow-hidden prose-table:rounded-2xl prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-700
                  prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:p-4 prose-th:text-left
                  prose-td:p-4 prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-slate-700"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }} 
                />
              </article>

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag: string) => (
                      <Link 
                        key={tag} 
                        to={\`/search?q=\${tag}\`} 
                        className="group flex items-center px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 transition-all"
                      >
                        <span className="text-blue-500 mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity">#</span>
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/50 rounded-3xl p-8 border border-blue-100/50 dark:border-slate-700/50 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm mb-12">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-lg border-4 border-white dark:border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-10 h-10 text-blue-500" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{post.author}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">Content Editor & Career Expert</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-2xl">
                    Dedicated to providing the latest and most accurate career notifications, job updates, and educational resources to help you achieve your professional goals.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#1DA1F2] transition-colors border border-slate-200 dark:border-slate-700">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0A66C2] transition-colors border border-slate-200 dark:border-slate-700">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-700">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-center border border-slate-800 shadow-2xl mb-12 group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 group-hover:bg-blue-500/30 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-blue-500/30">
                    <Send className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Stay Updated Instantly</h3>
                  <p className="text-slate-300 mb-8 max-w-md mx-auto text-lg">
                    Join our official Telegram channel to receive instant notifications for new jobs and results.
                  </p>
                  <button onClick={() => window.open('https://t.me/yourchannel', '_blank')} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/30 w-full sm:w-auto text-lg">
                    <TelegramIcon className="w-6 h-6 text-white" />
                    Join Telegram Channel
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
              
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm sticky top-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">On this page</h3>
                  <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4"></div>
                  <nav className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={\`text-left text-sm font-medium transition-all duration-200 line-clamp-2 \${
                          activeHeading === heading.id 
                            ? 'text-blue-600 dark:text-blue-400 translate-x-1' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        } \${heading.level === 3 ? 'pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-1' : ''}\`}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-gradient-to-b from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <Mail className="w-8 h-8 mb-4 text-blue-200" />
                  <h3 className="text-xl font-bold mb-2 tracking-tight">Weekly Career Digest</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Get hand-picked job notifications and career resources delivered straight to your inbox.
                  </p>
                  <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                    />
                    <button className="w-full px-4 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                      Subscribe Now
                    </button>
                  </form>
                  <p className="text-xs text-blue-200/60 mt-4 text-center">No spam. Unsubscribe anytime.</p>
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Trending Now</h3>
                <div className="flex flex-col gap-4">
                  {popularPosts.map((pp: any, idx: number) => (
                    <Link key={pp.id} to={\`/post/\${pp.id}\`} className="group flex gap-4 items-center">
                      <div className="text-4xl font-black text-slate-100 dark:text-slate-800 group-hover:text-blue-100 dark:group-hover:text-blue-900/30 transition-colors w-8 text-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {pp.title}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium mt-1 inline-block">{pp.readTime || '3 min read'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Join */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Join Community</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={() => window.open('https://t.me/yourchannel', '_blank')} className="w-full flex items-center justify-between px-4 py-3 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] rounded-xl transition-colors font-semibold group">
                    <div className="flex items-center gap-3">
                      <TelegramIcon className="w-5 h-5" />
                      Telegram
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                  <button onClick={() => window.open('https://chat.whatsapp.com/yourgroup', '_blank')} className="w-full flex items-center justify-between px-4 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl transition-colors font-semibold group">
                    <div className="flex items-center gap-3">
                      <WhatsAppIcon className="w-5 h-5" />
                      WhatsApp
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="container mx-auto px-4 max-w-6xl mt-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">More in {post.category}</h2>
              <Link to={\`/category/\${post.categorySlug}\`} className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-full transition-colors">
                View all articles
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/60 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2 h-full"
                  >
                    <div className={\`aspect-[4/3] bg-gradient-to-br \${relatedPost.imgGradient || 'from-slate-100 to-slate-200'} relative overflow-hidden\`}>
                      {relatedPost.featuredImage ? (
                        <img src={relatedPost.featuredImage} alt={relatedPost.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5">
                          <Tag className="w-12 h-12 text-slate-300 dark:text-slate-600 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {relatedPost.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        {relatedPost.readTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{relatedPost.readTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="container mx-auto px-4 max-w-4xl mt-24 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Thanks for reading!</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-full shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all">
              Back to Top
            </button>
            <Link to={\`/category/\${post.categorySlug}\`} className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold rounded-full shadow-sm hover:shadow-md border border-blue-100 dark:border-blue-800/50 transition-all">
              Browse More {post.category}
            </Link>
          </div>
        </div>

        {/* Mobile Sticky Share Bar */}
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 p-4 safe-area-bottom">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <span className="text-sm font-bold text-slate-900 dark:text-white hidden sm:block">Share:</span>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
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
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 h-10 rounded-full text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-sm transition-colors">
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
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
console.log("Rewrite complete.");
