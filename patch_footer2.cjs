const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const targetEmail = `<a href="mailto:{(SITE_SETTINGS as any).contactEmail || '{(SITE_SETTINGS as any).contactEmail || 'support@freecareernotice.com'}'}" className="hover:text-white transition-colors">
                  support@freecareernotice.com
                </a>`;
const replaceEmail = `<a href={\`mailto:\${(SITE_SETTINGS as any).contactEmail || 'support@freecareernotice.com'}\`} className="hover:text-white transition-colors">
                  {(SITE_SETTINGS as any).contactEmail || 'support@freecareernotice.com'}
                </a>`;

const targetCopyright = `<p>{(SITE_SETTINGS as any).footerCopyrightText || \`© \${new Date().getFullYear()} Free Career Notice. All rights reserved.\`}</p>`;
const replaceCopyright = `<div className="flex flex-col md:flex-row items-center md:items-start gap-1">
            <p>{(SITE_SETTINGS as any).footerCopyrightText || \`© \${new Date().getFullYear()} Free Career Notice. All rights reserved.\`}</p>
            {(SITE_SETTINGS as any).developerCredit && (
              <span className="text-slate-600"> | {(SITE_SETTINGS as any).developerCredit}</span>
            )}
          </div>`;

code = code.replace(targetEmail, replaceEmail);
code = code.replace(targetCopyright, replaceCopyright);
fs.writeFileSync('src/components/Footer.tsx', code);
console.log("Footer contact and copyright patched");
