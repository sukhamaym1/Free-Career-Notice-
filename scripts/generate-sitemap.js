import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  try {
    const owner = 'sukhamaym1';
    const repo = 'free-career-content';
    const branch = 'main';
    const contentRoot = 'content';

    const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${contentRoot}`;

    const fetchJson = async (url) => {
      const response = await fetch(url + '?t=' + Date.now());
      if (response.ok) return await response.json();
      return null;
    };

    const [posts, categories, settings, pagesRes] = await Promise.all([
      fetchJson(`${baseUrl}/posts.json`),
      fetchJson(`${baseUrl}/categories.json`),
      fetchJson(`${baseUrl}/settings.json`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${contentRoot}/pages`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'free-career-notice-sitemap'
        }
      })
    ]);

    let pages = [];
    if (pagesRes.ok) {
        pages = await pagesRes.json();
    }

    let siteUrl = 'https://free-career-notice.pages.dev';
    if (settings && settings.siteUrl) {
      siteUrl = settings.siteUrl.replace(/\/$/, '');
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/quiz</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (cat.slug) {
          xml += `
  <url>
    <loc>${siteUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      }
    }

    if (Array.isArray(posts)) {
      for (const post of posts) {
        if (post.status === 'published' && post.id) {
          xml += `
  <url>
    <loc>${siteUrl}/post/${post.id}</loc>
    <lastmod>${post.date ? new Date(post.date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        }
      }
    }

    if (Array.isArray(pages)) {
      for (const page of pages) {
        if (page.name && page.name.endsWith('.json')) {
          const pageId = page.name.replace('.json', '');
          xml += `
  <url>
    <loc>${siteUrl}/${pageId}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
        }
      }
    }

    xml += `\n</urlset>`;

    const publicPath = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml);
    console.log('Sitemap generated successfully at public/sitemap.xml');
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
}

generateSitemap();
