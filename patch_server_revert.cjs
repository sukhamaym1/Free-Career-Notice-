const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  app.get('/sitemap.xml', async (req, res) => {
    try {
      const { owner, repo, branch, contentRoot } = CMS_CONFIG.github;
      const baseUrl = \\\`https://raw.githubusercontent.com/\\\${owner}/\\\${repo}/\\\${branch}/\\\${contentRoot}\\\`;

      // Helper for fetching json
      const fetchJson = async (url) => {
        const response = await fetch(url + '?t=' + Date.now());
        if (response.ok) return await response.json();
        return null;
      };

      const [posts, categories, settings, pages] = await Promise.all([
        fetchJson(\\\`\\\${baseUrl}/posts.json\\\`),
        fetchJson(\\\`\\\${baseUrl}/categories.json\\\`),
        fetchJson(\\\`\\\${baseUrl}/settings.json\\\`),
        // For pages, we can't easily list directory from raw.githubusercontent.com, so we use API
        fetch(\\\`https://api.github.com/repos/\\\${owner}/\\\${repo}/contents/\\\${contentRoot}/pages\\\`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'free-career-notice-sitemap',
            ...(process.env.GITHUB_PAT ? { 'Authorization': \\\`Bearer \\\${process.env.GITHUB_PAT}\\\` } : {})
          }
        }).then(r => r.ok ? r.json() : [])
      ]);

      let siteUrl = 'https://free-career-notice.pages.dev'; // fallback
      if (settings && settings.siteUrl) {
        siteUrl = settings.siteUrl.replace(/\\/$/, '');
      } else {
        const host = req.get('host') || 'localhost:3000';
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        siteUrl = \\\`\\\${protocol}://\\\${host}\\\`;
      }

      let xml = \\\`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>\\\${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>\\\${siteUrl}/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>\\\${siteUrl}/quiz</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\\\`;

      if (Array.isArray(categories)) {
        for (const cat of categories) {
          if (cat.slug) {
            xml += \\\`
  <url>
    <loc>\\\${siteUrl}/category/\\\${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\\\`;
          }
        }
      }

      if (Array.isArray(posts)) {
        for (const post of posts) {
          if (post.status === 'published' && post.id) {
            xml += \\\`
  <url>
    <loc>\\\${siteUrl}/post/\\\${post.id}</loc>
    <lastmod>\\\${post.date ? new Date(post.date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\\\`;
          }
        }
      }

      if (Array.isArray(pages)) {
        for (const page of pages) {
          if (page.name && page.name.endsWith('.json')) {
            const pageId = page.name.replace('.json', '');
            xml += \\\`
  <url>
    <loc>\\\${siteUrl}/\\\${pageId}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\\\`;
          }
        }
      }

      xml += \\\`\\n</urlset>\\\`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      console.error('Sitemap Error:', err);
      res.status(500).send('Error generating sitemap');
    }
  });

`;

// Let's just use regex to remove it
code = code.replace(/app\.get\('\/sitemap\.xml'[\s\S]*?res\.status\(500\)\.send\('Error generating sitemap'\);\s*}\s*}\);/g, '');

fs.writeFileSync('server.ts', code);
