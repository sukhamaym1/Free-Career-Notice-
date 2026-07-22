import fs from 'fs';
let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

const originalIcon = `<div className="bg-blue-600 p-2 rounded-lg text-white">
            <GraduationCap className="w-6 h-6" />
          </div>`;
          
const newIcon = `{(SITE_SETTINGS as any).logoUrl ? (
            <img src={(SITE_SETTINGS as any).logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
          ) : (
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
          )}`;
          
content = content.replace(originalIcon, newIcon);
fs.writeFileSync('src/components/Header.tsx', content);
