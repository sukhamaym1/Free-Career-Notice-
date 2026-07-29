import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterBrand({ settings }: { settings: any }) {
  return (
    <div className="space-y-4">
      <Link to="/" className="flex items-center gap-3">
        {settings.footerLogo ? (
          <img src={settings.footerLogo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" loading="lazy" />
        ) : (
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20">
            <GraduationCap className="w-6 h-6 md:w-7 md:h-7" />
          </div>
        )}
        <div className="font-bold text-xl md:text-2xl leading-none tracking-tight text-white uppercase">
          {settings.siteName || 'FREE CAREER\nNOTICE'}
        </div>
      </Link>
      <p className="text-sm text-slate-400 leading-relaxed pr-4">
        {settings.footerDescription || 'Free Career Notice is your trusted platform for the latest Government Jobs, Results, Admit Cards, Syllabus and all important Career Updates.'}
      </p>
    </div>
  );
}
