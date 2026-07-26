import fs from 'fs';

let content = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf-8');

// Wrap "Click Here!!!" in a link
content = content.replace(
  /<div className="mt-4 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full text-sm">\s*Click Here!!!\s*<\/div>/g,
  '<Link to={`/post/${item.id}`} className="mt-4 inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full text-sm">\n                    Click Here!!!\n                  </Link>'
);

// Wrap thumbnail in a link
content = content.replace(
  /\{item\.tag \|\| title\}\s*<\/h3>/g,
  '{item.tag || title}\n                  </h3>'
);

fs.writeFileSync('src/pages/CategoryPage.tsx', content);
