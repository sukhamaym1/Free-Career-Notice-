import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    // Add the callback function globally
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'bn',
          includedLanguages: 'en,hi,bn',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
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
      // Re-initialize if the script is already loaded but we navigated
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement && !translateElement.hasChildNodes()) {
         (window as any).googleTranslateElementInit();
      }
    }
  }, []);

  return (
    <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Language:</span>
      <div id="google_translate_element" className="min-h-[32px]"></div>
    </div>
  );
}
