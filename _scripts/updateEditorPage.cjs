const fs = require('fs');

let content = fs.readFileSync('src/admin/pages/EditorPage.tsx', 'utf8');

// We will inject new states
content = content.replace("const isEdit = !!editingPost;", `const isEdit = !!editingPost;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
`);

// Add lucide imports
content = content.replace("FileCode2, CheckCircle2, ChevronRight", "FileCode2, CheckCircle2, ChevronRight, Maximize, Minimize, Focus, X, Save");

// Add global shortcut handler
content = content.replace("// Basic drafts implementation", `// Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullScreen(prev => !prev);
      }
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('post-editor-form') as HTMLFormElement;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          setSaveStatus('✓ Saved');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Basic drafts implementation`);

// Fix autosave interval
content = content.replace("localStorage.setItem(saveKey, JSON.stringify(data));", `localStorage.setItem(saveKey, JSON.stringify(data));
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        setSaveStatus(\`Auto Saved at \${time}\`);`);
content = content.replace("}, 60000);", "}, 30000);");

// Replace render wrapper
const oldReturn = `  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 animate-in fade-in duration-300">`;
const newReturn = `  return (
    <div className={cn(
      isFullScreen 
        ? "fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 overflow-y-auto w-screen h-screen" 
        : "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 animate-in fade-in duration-300 relative"
    )}>
      {isFullScreen && (
        <div className="sticky top-0 left-0 right-0 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-[110] flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setIsFullScreen(false)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-sm font-medium">
              <X className="w-4 h-4" /> Exit Full Screen (ESC)
            </button>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
              <button type="button" onClick={() => setIsDistractionFree(!isDistractionFree)} className={cn("px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5", isDistractionFree ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800")}>
                <Maximize className="w-4 h-4" /> Writing Mode
              </button>
              <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className={cn("px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5", isFocusMode ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400" : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800")}>
                <Focus className="w-4 h-4" /> Focus Mode
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-2">{saveStatus}</span>}
            <button type="submit" form="post-editor-form" className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save Post
            </button>
          </div>
        </div>
      )}

      {!isFullScreen && saveStatus && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-100 dark:bg-emerald-900/90 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" /> {saveStatus}
        </div>
      )}

      <div className={cn(
        "transition-all duration-300 mx-auto",
        isFullScreen ? "max-w-7xl pt-8 px-4 pb-12" : ""
      )}>`;
content = content.replace(oldReturn, newReturn);

// We need to add cn import if not present
if (!content.includes('import { cn }')) {
  content = content.replace("import RichTextEditor", "import { cn } from '../../lib/utils';\nimport RichTextEditor");
}

// Modify the old header
content = content.replace(
  '<div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">',
  `{!isFullScreen && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">`
);

content = content.replace(
  '</button>\n        </div>\n      </div>',
  `</button>
          <button type="button" onClick={() => setIsFullScreen(true)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm hidden sm:flex">
            <Maximize className="w-4 h-4" /> Full Screen
          </button>
        </div>
      </div>
      )}`
);

// Grid layout wrapper
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">',
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">'
);

// Left column
content = content.replace(
  '<div className="lg:col-span-2 space-y-6">',
  `<div className={cn("space-y-6 transition-all duration-500 relative", (isFullScreen && isDistractionFree) ? "col-span-3 max-w-4xl mx-auto w-full" : "lg:col-span-2")}>`
);

// Title styling to make it sticky
content = content.replace(
  '<div>\n                <input \n                  name="title"',
  `<div className={cn("sticky z-30 bg-slate-50/90 dark:bg-[#0B1120]/90 backdrop-blur-md py-4 transition-all duration-300", isFullScreen ? "top-14" : "top-0")}>
                <input 
                  name="title"`
);
// replace placeholder text sizes
content = content.replace(
  'className="w-full text-3xl font-bold bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 px-0"',
  'className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 px-0 py-2 outline-none"'
);


// Excerpt hide when distraction free
content = content.replace(
  '<div>\n                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Excerpt</label>',
  `{!isDistractionFree && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Excerpt</label>`
);

content = content.replace(
  '</textarea>\n              </div>\n            </div>',
  `</textarea>
              </div>
            )}
            </div>`
);


// Right sidebar wrapping
content = content.replace(
  '<div className="space-y-6">',
  `{!(isFullScreen && isDistractionFree) && (
            <div className="space-y-6">`
);

content = content.replace(
  '<SEOCalculator />\n        </div>',
  `<SEOCalculator />
        </div>
      )}`
);

// Close wrapper
content = content.replace(
  '</form>\n    </div>\n  );\n}',
  `</form>\n      </div>\n    </div>\n  );\n}`
);


// Inject isFocusMode to RichTextEditor
content = content.replace(
  '<RichTextEditor \n                  content={editingPost?.content || \'\'}',
  `<RichTextEditor 
                  isFocusMode={isFocusMode}
                  content={editingPost?.content || ''}`
);


fs.writeFileSync('src/admin/pages/EditorPage.tsx', content);

