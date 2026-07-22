import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf-8');

if (!content.includes('import settingsData from')) {
  content = `import settingsData from '../content/settings.json';\n\n` + content;
  content += `\nexport const SITE_SETTINGS = settingsData;\n`;
}

fs.writeFileSync('src/data.ts', content);
