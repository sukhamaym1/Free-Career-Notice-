import fs from 'fs';

let content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

const targetReturn = `  const postUrl = window.location.href;

  return (`;

const replacementReturn = `  const postUrl = window.location.href;
  
  const relatedPosts = ALL_POSTS
    .filter((p: any) => p.categorySlug === post.categorySlug && p.id !== post.id)
    .slice(0, 3);

  return (`;

content = content.replace(targetReturn, replacementReturn);

const targetArticleEnd = `        </div>
      </article>
    </main>
    </>
  );
}`;

const replacementArticleEnd = `        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <Link 
                key={relatedPost.id} 
                to={\`/post/\${relatedPost.id}\`}
                className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all block"
              >
                <div className={\`h-32 bg-gradient-to-br \${relatedPost.imgGradient} relative overflow-hidden\`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-4 left-4 right-4">
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
    </main>
    </>
  );
}`;

content = content.replace(targetArticleEnd, replacementArticleEnd);

fs.writeFileSync('src/pages/PostPage.tsx', content);
console.log('Patched PostPage.tsx with Related Posts');
