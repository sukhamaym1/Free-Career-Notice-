import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('bn');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial language from cookie
    const match = document.cookie.match(/googtrans=\/bn\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    } else {
      setCurrentLang('bn');
    }

    // Add the callback function globally for the hidden widget
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'bn',
          includedLanguages: 'en,hi,bn',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Check if script is already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).google && (window as any).google.translate) {
      // Re-initialize if the script is already loaded
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement && !translateElement.hasChildNodes()) {
         (window as any).googleTranslateElementInit();
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      const optionExists = Array.from(select.options).some(opt => opt.value === langCode);
      if (optionExists) {
        select.value = langCode;
      } else if (langCode === 'bn') {
        select.value = ''; // Google Translate uses '' for original language
      }
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Also set the cookie to be safe
    if (langCode === 'bn') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
      document.cookie = `googtrans=/bn/${langCode}; path=/;`;
      document.cookie = `googtrans=/bn/${langCode}; path=/; domain=${window.location.hostname}`;
    }
  };

  const activeLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative notranslate" ref={dropdownRef}>
      {/* Hidden original widget */}
      <div id="google_translate_element" className="hidden"></div>
      
      <style>{`
        /* Hide the top Google Translate banner */
        body { top: 0 !important; }
        .goog-te-banner-frame { display: none !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-spinner-pos { display: none !important; }
      `}</style>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {activeLang.label}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className={currentLang === lang.code ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300'}>
                {lang.label}
              </span>
              {currentLang === lang.code && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
