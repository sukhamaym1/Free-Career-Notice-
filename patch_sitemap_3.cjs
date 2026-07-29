const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `<loc>\\$\\{siteUrl\\}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\`;`.replace(/\\/g, '');

const replacement = `<loc>\\$\\{siteUrl\\}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>\\$\\{siteUrl\\}/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>\\$\\{siteUrl\\}/quiz</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\`;`.replace(/\\/g, '');

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
