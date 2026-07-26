import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

// Remove NewUpdates import
content = content.replace(/import NewUpdates from '\.\.\/components\/NewUpdates';\n/g, '');

// Remove NewUpdates component from render
content = content.replace(/<motion\.div variants=\{itemVariants\}>\s*<NewUpdates \/>\s*<\/motion\.div>/g, '');

fs.writeFileSync('src/pages/HomePage.tsx', content);
