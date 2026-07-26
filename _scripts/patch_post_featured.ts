import fs from 'fs';

let content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

const oldHeader = `
        {/* Featured Header Area */}
        <div className={\`relative h-64 md:h-[400px] bg-gradient-to-br \${post.imgGradient} p-8 flex flex-col justify-end overflow-hidden\`}>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl">
`.trim();

const newHeader = `
        {/* Featured Header Area */}
        <div className={\`relative h-64 md:h-[400px] bg-gradient-to-br \${post.imgGradient || 'from-blue-600 to-indigo-800'} p-8 flex flex-col justify-end overflow-hidden\`}>
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
          
          <div className="relative z-10 max-w-3xl">
`.trim();

content = content.replace(oldHeader, newHeader);


// Also replace the related posts section to show the image too, if they have it
const oldRelated = `
                <div className={\`h-32 bg-gradient-to-br \${relatedPost.imgGradient} relative overflow-hidden\`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-4 left-4 right-4">
`.trim();

const newRelated = `
                <div className={\`h-32 bg-gradient-to-br \${relatedPost.imgGradient || 'from-gray-700 to-gray-900'} relative overflow-hidden\`}>
                  {relatedPost.featuredImage ? (
                    <>
                      <img src={relatedPost.featuredImage} alt={relatedPost.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-0"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-0"></div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
`.trim();

content = content.replace(oldRelated, newRelated);

fs.writeFileSync('src/pages/PostPage.tsx', content);
console.log("Patched PostPage.tsx");
