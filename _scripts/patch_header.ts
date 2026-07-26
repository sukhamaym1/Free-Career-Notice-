import fs from 'fs';

let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

if (!content.includes('import { SITE_SETTINGS }')) {
  content = content.replace(
    `import { Link, useNavigate } from 'react-router-dom';`,
    `import { Link, useNavigate } from 'react-router-dom';\nimport { SITE_SETTINGS } from '../data';`
  );
  
  const originalLogoText = `Free Career <br />\n            <span className="text-green-600 dark:text-green-500">Notice</span>`;
  const newLogoText = `{SITE_SETTINGS.siteName || 'Free Career Notice'}`;
  
  // Just replacing the text directly
  content = content.replace(originalLogoText, newLogoText);
}

fs.writeFileSync('src/components/Header.tsx', content);
