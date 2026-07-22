import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

if (!content.includes('import { SITE_SETTINGS }')) {
  content = content.replace(
    `import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';`,
    `import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';\nimport { SITE_SETTINGS } from '../data';`
  );
  
  content = content.replace(
    `Search Latest Jobs, Admit Card & Results`,
    `{ (SITE_SETTINGS as any).heroTitle || 'Search Latest Jobs, Admit Card & Results' }`
  );
  
  // Also add description below title if it exists
  const titleEnd = `</h1>`;
  if (content.includes(titleEnd)) {
    content = content.replace(
      titleEnd,
      `</h1>\n      {(SITE_SETTINGS as any).heroDescription && (\n        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">\n          {(SITE_SETTINGS as any).heroDescription}\n        </p>\n      )}`
    );
  }
}

fs.writeFileSync('src/components/Hero.tsx', content);
