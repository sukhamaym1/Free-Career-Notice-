const fs = require('fs');

let content = fs.readFileSync('src/admin/pages/EditorPage.tsx', 'utf8');

content = content.replace(
  '<div className={cn("sticky z-30 bg-slate-50/90 dark:bg-[#0B1120]/90 backdrop-blur-md py-4 transition-all duration-300", isFullScreen ? "top-14" : "top-0")}>',
  '<div className="bg-transparent py-4 transition-all duration-300">'
);

fs.writeFileSync('src/admin/pages/EditorPage.tsx', content);

