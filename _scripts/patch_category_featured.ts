import fs from 'fs';

let content = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf-8');

// Replace the Thumbnail Placeholder
const oldThumbnail = `
                    {/* Thumbnail Placeholder */}
                    <div className={\`relative h-48 md:h-64 bg-gradient-to-br \${item.imgGradient || 'from-gray-700 to-gray-900'} p-6 flex flex-col justify-center items-center text-center overflow-hidden\`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                      
                      {/* Tag */}
                      {item.tag && (
                        <div className={\`absolute top-4 right-4 \${item.tagColor || 'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10 shadow-sm\`}>
                          {item.tag}
                        </div>
                      )}
                      
                      {/* Decorative background elements */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                      
                      {/* Mock content for the thumbnail */}
                      <div className="relative z-10 max-w-[80%]">
                        <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight mb-2 uppercase">
                          {item.tag || title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-sm">
                          {item.title.substring(0, 45)}...
                        </p>
                        <Link to={\`/post/\${item.id}\`} className="mt-4 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full text-sm">
                          Click Here!!!
                        </Link>
                      </div>
                    </div>
`.trim();

const newThumbnail = `
                    {/* Thumbnail */}
                    <div className={\`relative h-48 md:h-64 bg-gradient-to-br \${item.imgGradient || 'from-gray-700 to-gray-900'} p-6 flex flex-col justify-center items-center text-center overflow-hidden\`}>
                      {item.featuredImage ? (
                        <>
                          <img src={item.featuredImage} alt={item.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-0"></div>
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-0"></div>
                          {/* Decorative background elements */}
                          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl z-0"></div>
                          <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl z-0"></div>
                        </>
                      )}
                      
                      {/* Tag */}
                      {item.tag && (
                        <div className={\`absolute top-4 right-4 \${item.tagColor || 'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10 shadow-sm\`}>
                          {item.tag}
                        </div>
                      )}
                      
                      {/* Mock content for the thumbnail (only show if no featured image) */}
                      {!item.featuredImage && (
                        <div className="relative z-10 max-w-[80%]">
                          <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md leading-tight mb-2 uppercase">
                            {item.tag || title}
                          </h3>
                          <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-sm">
                            {item.title.substring(0, 45)}...
                          </p>
                          <Link to={\`/post/\${item.id}\`} className="mt-4 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-yellow-300 transition-colors">
                            Click Here!!!
                          </Link>
                        </div>
                      )}
                    </div>
`.trim();

content = content.replace(oldThumbnail, newThumbnail);

fs.writeFileSync('src/pages/CategoryPage.tsx', content);
console.log("Patched CategoryPage.tsx");
