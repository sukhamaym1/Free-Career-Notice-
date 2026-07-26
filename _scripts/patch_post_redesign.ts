import fs from 'fs';

let content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

// Replace everything from `<main ...` to the end of `<article ...>`
const mainStart = content.indexOf('<main');
const articleEnd = content.indexOf('</article>') + '</article>'.length;

const oldPart = content.slice(mainStart, articleEnd);

const newPart = `
      <main className="animate-in fade-in duration-500 pb-20">
      <article>
        {/* Featured Header Area - Full bleed */}
        <div className={\`relative w-full h-[40vh] min-h-[320px] max-h-[500px] bg-gradient-to-br \${post.imgGradient || 'from-blue-600 to-indigo-800'} flex flex-col justify-end overflow-hidden\`}>
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
            <Link to={\`/category/\${post.categorySlug}\`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">{post.category}</Link>
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
                  <button onClick={() => window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(postUrl)}\`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#1877F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1877F2]/90 transition-colors shadow-sm" title="Share on Facebook">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button onClick={() => window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(postUrl)}&text=\${encodeURIComponent(post.title)}\`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#1DA1F2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#1DA1F2]/90 transition-colors shadow-sm" title="Share on Twitter">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button onClick={() => window.open(\`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(postUrl)}&title=\${encodeURIComponent(post.title)}\`, '_blank', 'noopener,noreferrer')} className="flex-1 bg-[#0A66C2] text-white p-2.5 rounded-lg flex justify-center hover:bg-[#0A66C2]/90 transition-colors shadow-sm" title="Share on LinkedIn">
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
                    <Link key={tag} to={\`/search?q=\${tag}\`} className="px-3 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors shadow-sm">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
`.trim();

content = content.slice(0, mainStart) + newPart + content.slice(articleEnd);

// Also need to wrap the related posts section in the max-w-5xl container
const relatedStart = content.indexOf('{/* Related Posts */}');
if (relatedStart > -1) {
    const relatedSection = content.slice(relatedStart);
    content = content.slice(0, relatedStart) + `<div className="container mx-auto px-4 max-w-5xl">\n      ` + relatedSection.replace('</main>', '</div>\n    </main>');
}

fs.writeFileSync('src/pages/PostPage.tsx', content);
console.log("Patched PostPage.tsx Redesign");
