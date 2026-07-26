import fs from 'fs';

let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

if (!content.includes('import { SITE_SETTINGS }')) {
  content = content.replace(
    `import { Link } from 'react-router-dom';`,
    `import { Link } from 'react-router-dom';\nimport { SITE_SETTINGS } from '../data';`
  );

  // Replace text
  content = content.replace(
    `Free Career <br />\n                <span className="text-green-500">Notice</span>`,
    `{SITE_SETTINGS.siteName || 'Free Career Notice'}`
  );
  
  content = content.replace(
    `Your trusted portal for the latest job notifications, admit cards, exam results, and career updates across India. Stay ahead in your career journey with real-time alerts.`,
    `{SITE_SETTINGS.footerDescription || 'Your trusted portal for the latest job notifications.'}`
  );

  content = content.replace(
    `123 Career Avenue, Tech Park, Block B, New Delhi, India 110001`,
    `{SITE_SETTINGS.contactAddress || '123 Career Avenue, New Delhi, India'}`
  );
  
  content = content.replace(
    `+91 98765 43210`,
    `{SITE_SETTINGS.contactPhone || '+91 98765 43210'}`
  );
  
  content = content.replace(
    `support@freecareernotice.com`,
    `{SITE_SETTINGS.contactEmail || 'support@freecareernotice.com'}`
  );

  content = content.replace(
    `support@freecareernotice.com`, // the visible text
    `{SITE_SETTINGS.contactEmail || 'support@freecareernotice.com'}`
  );

  content = content.replace(
    `© {new Date().getFullYear()} Free Career Notice. All rights reserved.`,
    `{SITE_SETTINGS.footerCopyrightText || \`© \${new Date().getFullYear()} Free Career Notice. All rights reserved.\`}`
  );
}

fs.writeFileSync('src/components/Footer.tsx', content);
