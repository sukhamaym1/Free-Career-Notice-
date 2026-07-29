import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData } from './DataProvider';
import { AnimatePresence, motion } from 'motion/react';

export default function HomepagePopup() {
  const { SITE_SETTINGS } = useData();
  const settings = SITE_SETTINGS as any;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (settings.enableHomepagePopup && settings.homepagePopupContent) {
      // Check if already shown in this session
      const hasShown = sessionStorage.getItem('homepagePopupShown');
      if (!hasShown) {
        setIsOpen(true);
        sessionStorage.setItem('homepagePopupShown', 'true');
      }
    }
  }, [settings]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mt-2" dangerouslySetInnerHTML={{ __html: settings.homepagePopupContent }} />
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
