import fs from 'fs';

let content = fs.readFileSync('src/pages/TextPage.tsx', 'utf-8');

if (!content.includes('import { SITE_SETTINGS }')) {
  content = `import { useParams } from 'react-router-dom';
import { SITE_SETTINGS } from '../data';

export default function TextPage() {
  const { pageId } = useParams();
  
  const staticPagesList = [
    { id: 'about-us', name: 'About Us' },
    { id: 'contact-us', name: 'Contact Us' },
    { id: 'privacy-policy', name: 'Privacy Policy' },
    { id: 'terms-and-conditions', name: 'Terms & Conditions' },
    { id: 'disclaimer', name: 'Disclaimer' },
    { id: 'dmca', name: 'DMCA' },
    { id: 'cookie-policy', name: 'Cookie Policy' },
    { id: 'editorial-policy', name: 'Editorial Policy' },
    { id: 'correction-policy', name: 'Correction Policy' }
  ];

  const pageDef = staticPagesList.find(p => p.id === pageId);
  const pageTitle = pageDef ? pageDef.name : 'Page Not Found';
  const pageContentHtml = (SITE_SETTINGS as any).staticPages?.[pageId as string] || '<p>The page you are looking for does not exist or has no content.</p>';

  return (
    <main className="container mx-auto px-4 py-16 pb-32 animate-in fade-in duration-500 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          {pageTitle}
        </h1>
        <div 
          className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose"
          dangerouslySetInnerHTML={{ __html: pageContentHtml }}
        />
      </div>
    </main>
  );
}
`;
}

fs.writeFileSync('src/pages/TextPage.tsx', content);
