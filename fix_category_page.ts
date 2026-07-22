import fs from 'fs';

let content = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf-8');

// Fix the hardcoded post URLs
content = content.replace(
  /<Link to="\/post\/wbpsc-recruitment-2026">\{item\.title\}<\/Link>/g,
  '<Link to={`/post/${item.id}`}>{item.title}</Link>'
);

content = content.replace(
  /<Link to="\/post\/wbpsc-recruitment-2026" className="([^"]+)">\s*READ MORE »\s*<\/Link>/g,
  '<Link to={`/post/${item.id}`} className="$1">\n                    READ MORE »\n                  </Link>'
);

fs.writeFileSync('src/pages/CategoryPage.tsx', content);
