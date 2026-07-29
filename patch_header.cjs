const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const target = `<div className="font-bold text-xl leading-none tracking-tight text-gray-900 dark:text-white">
            {SITE_SETTINGS.siteName || 'Free Career Notice'}
          </div>`;

const replacement = `<div className="flex flex-col">
            <div className="font-bold text-xl leading-none tracking-tight text-gray-900 dark:text-white">
              {SITE_SETTINGS.siteName || 'Free Career Notice'}
            </div>
            {SITE_SETTINGS.siteTagline && (
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-semibold hidden sm:block">
                {SITE_SETTINGS.siteTagline}
              </div>
            )}
          </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Header.tsx', code);
console.log("Header patched with siteTagline");
