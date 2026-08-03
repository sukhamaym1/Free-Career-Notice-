import { FileQuestion, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from './DataProvider';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
  </svg>
);

export default function ActionGroup() {
  const { SITE_SETTINGS } = useData();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Card */}
        <a
          href={(SITE_SETTINGS as any).socialWhatsAppChannel || '#'}
          target={(SITE_SETTINGS as any).socialWhatsAppChannel ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-[#061B10] border border-slate-200 dark:border-green-900/30 overflow-hidden hover:-translate-y-1 transition-all duration-300"
        >
          {/* Animated Glow Border Effect */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-[1px] bg-white dark:bg-[#061B10] rounded-[15px] z-10" />
          </div>

          <div className="relative z-20 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <WhatsAppIcon className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Join WhatsApp Channel</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Instant Job Alerts</p>
            </div>
          </div>
          <div className="relative z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 dark:group-hover:bg-green-900/30 dark:group-hover:text-green-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </a>

        {/* Mock Test Card */}
        <Link
          to="/quiz"
          className="group relative flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-[#11061b] border border-slate-200 dark:border-purple-900/30 overflow-hidden hover:-translate-y-1 transition-all duration-300"
        >
          {/* Animated Glow Border Effect */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-[1px] bg-white dark:bg-[#11061b] rounded-[15px] z-10" />
          </div>

          <div className="relative z-20 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <FileQuestion className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Free Mock Test & Quiz</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Practice & Improve</p>
            </div>
          </div>
          <div className="relative z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </Link>

        {/* Telegram Card */}
        <a
          href={(SITE_SETTINGS as any).socialTelegram || '#'}
          target={(SITE_SETTINGS as any).socialTelegram ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-[#06141F] border border-slate-200 dark:border-sky-900/30 overflow-hidden hover:-translate-y-1 transition-all duration-300"
        >
          {/* Animated Glow Border Effect */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-[1px] bg-white dark:bg-[#06141F] rounded-[15px] z-10" />
          </div>

          <div className="relative z-20 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <TelegramIcon className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Join Telegram Channel</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Daily Updates & PDFs</p>
            </div>
          </div>
          <div className="relative z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-600 dark:group-hover:bg-sky-900/30 dark:group-hover:text-sky-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </a>
      </div>
    </section>
  );
}
