const fs = require('fs');
let code = fs.readFileSync('src/pages/TextPage.tsx', 'utf8');

const target = `  const { PUBLISHED_POSTS, SITE_SETTINGS } = useData();
  const { pageId } = useParams();`;
const replacement = `  const { SITE_SETTINGS, STATIC_PAGES } = useData();
  const { pageId } = useParams();`;
code = code.replace(target, replacement);

const target2 = `  const pageContentHtml = (SITE_SETTINGS as any).staticPages?.[pageId as string] || '<p>The page you are looking for does not exist or has no content.</p>';`;
const replacement2 = `  const pageContentHtml = STATIC_PAGES?.[pageId as string] || (SITE_SETTINGS as any).staticPages?.[pageId as string] || '<p>The page you are looking for does not exist or has no content.</p>';`;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/pages/TextPage.tsx', code);
