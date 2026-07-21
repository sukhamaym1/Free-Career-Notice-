import { useParams } from 'react-router-dom';

export default function TextPage() {
  const { pageId } = useParams();

  const contentMap: Record<string, { title: string; content: string }> = {
    'privacy-policy': {
      title: 'Privacy Policy',
      content: 'This is a sample privacy policy for Free Career Notice. We value your privacy and are committed to protecting your personal information. We do not sell or share your data with third parties.',
    },
    'terms-of-service': {
      title: 'Terms of Service',
      content: 'By using Free Career Notice, you agree to these terms. The information provided on this website is for educational and informational purposes only. We strive to provide accurate information but do not guarantee it.',
    },
    'disclaimer': {
      title: 'Disclaimer',
      content: 'Free Career Notice is not affiliated with any government organization. All information provided is collected from various sources and is for educational purposes. Always verify from official websites.',
    }
  };

  const page = pageId && contentMap[pageId] ? contentMap[pageId] : { title: 'Page Not Found', content: 'The page you are looking for does not exist.' };

  return (
    <main className="container mx-auto px-4 py-16 pb-32 animate-in fade-in duration-500 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          {page.title}
        </h1>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose">
          <p>{page.content}</p>
        </div>
      </div>
    </main>
  );
}
