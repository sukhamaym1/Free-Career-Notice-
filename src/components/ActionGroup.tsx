import { MessageCircle, FileQuestion, Send, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from './DataProvider';

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
              <MessageCircle className="w-6 h-6 fill-current" />
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
              <Send className="w-6 h-6 fill-current" />
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
