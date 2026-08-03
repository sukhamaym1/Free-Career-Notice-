import { ArrowUp } from 'lucide-react';

export default function FooterBottom({ settings }: { settings: any }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
        <span>{settings.footerCopyrightText || `© ${new Date().getFullYear()} Free Career Notice. All Rights Reserved.`}</span>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-1.5 text-center">
        <span>Created by <strong className="text-slate-300 font-medium">S Adhikary</strong></span>
        {settings.developerCredit && (
           <span className="hidden md:inline ml-2 pl-2 border-l border-slate-700">{settings.developerCredit}</span>
        )}
      </div>

      {settings.enableBackToTop !== false && (
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:text-white transition-colors group"
          aria-label="Back to Top"
        >
          Back to Top
          <div className="w-6 h-6 rounded-full border border-slate-600 group-hover:border-blue-500 flex items-center justify-center transition-colors">
            <ArrowUp className="w-3.5 h-3.5 group-hover:text-blue-500 transition-colors" />
          </div>
        </button>
      )}
    </div>
  );
}
