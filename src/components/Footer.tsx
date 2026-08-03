import { useData } from '../components/DataProvider';
import FooterBrand from './footer/FooterBrand';
import FooterNewsletter from './footer/FooterNewsletter';
import FooterSocial from './footer/FooterSocial';
import FooterLinks from './footer/FooterLinks';
import FooterContact from './footer/FooterContact';
import FooterStats from './footer/FooterStats';
import FooterBottom from './footer/FooterBottom';
import { Link2, Folder, Bell, Wrench } from 'lucide-react';

export default function Footer() {
  const { SITE_SETTINGS } = useData();
  const settings = SITE_SETTINGS as any;

  const defaultQuickLinks = [
    { label: 'Home', url: '/' },
    { label: 'Latest Jobs', url: '/category/job-notifications' },
    { label: 'Admit Card', url: '/category/admit-card' },
    { label: 'Results', url: '/category/results' },
    { label: 'Syllabus', url: '/category/syllabus' },
    { label: 'Answer Key', url: '/category/answer-keys' },
    { label: 'Contact Us', url: '/contact-us' }
  ];

  const defaultCategories = [
    { label: 'Government Jobs', url: '/category/job-notifications' },
    { label: 'Bank Jobs', url: '/category/banking' },
    { label: 'Railway Jobs', url: '/category/railway' },
    { label: 'Defence Jobs', url: '/category/defence' },
    { label: 'Teaching Jobs', url: '/category/teaching' },
    { label: 'Police Jobs', url: '/category/defence' },
    { label: 'All Categories', url: '/category/job-notifications' }
  ];

  const defaultImportant = [
    { label: 'About Us', url: '/about-us' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Disclaimer', url: '/disclaimer' },
    { label: 'Terms & Conditions', url: '/terms-and-conditions' },
    { label: 'Cookie Policy', url: '/cookie-policy' },
    { label: 'Sitemap', url: '/sitemap' },
    { label: 'Contact Us', url: '/contact-us' },
    { label: 'DMCA Policy', url: '/dmca' }
  ];

  const defaultTools = [
    { label: 'Daily Current Affairs', url: '/category/current-affairs' },
    { label: 'Weekly Quiz', url: '/quiz' },
    { label: 'GK & GS Notes', url: '/study-material' },
    { label: 'Exam Preparation', url: '/category/syllabus' },
    { label: 'Study Materials', url: '/study-material' },
    { label: 'Online Tests', url: '/quiz' },
    { label: 'Interview Tips', url: '/category/tips' }
  ];

  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 text-slate-300 font-sans">
      {/* Top Section: Brand & Newsletter */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            <div className="lg:col-span-4">
              <FooterBrand settings={settings} />
            </div>
            
            <div className="lg:col-span-5">
              {settings.enableNewsletter !== false && (
                <FooterNewsletter settings={settings} />
              )}
            </div>
            
            <div className="lg:col-span-3">
              <FooterSocial settings={settings} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <FooterLinks 
            title="Quick Links" 
            icon={<Link2 className="w-5 h-5" />} 
            links={settings.quickLinks} 
            defaultLinks={defaultQuickLinks} 
          />
          <FooterLinks 
            title="Categories" 
            icon={<Folder className="w-5 h-5" />} 
            links={settings.footerCategories} 
            defaultLinks={defaultCategories} 
          />
          <FooterLinks 
            title="Important" 
            icon={<Bell className="w-5 h-5" />} 
            links={settings.importantPages} 
            defaultLinks={defaultImportant} 
          />
          <FooterLinks 
            title="Useful Tools" 
            icon={<Wrench className="w-5 h-5" />} 
            links={settings.usefulTools} 
            defaultLinks={defaultTools} 
          />
          <FooterContact settings={settings} />
        </div>

        {/* Stats Section */}
        <FooterStats settings={settings} />

        {/* Bottom Bar */}
        <FooterBottom settings={settings} />
      </div>
    </footer>
  );
}
