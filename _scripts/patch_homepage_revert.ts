import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

// Replace imports
content = content.replace(
  /import \{ useState, useMemo \} from 'react';\nimport \{ PUBLISHED_POSTS, JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS \} from '\.\.\/data';\nimport TagFilter from '\.\.\/components\/TagFilter';/,
  "import { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } from '../data';"
);

// Remove hooks
const hooksRegex = /const \[selectedTag[\s\S]*?\}, \[selectedTag\]\);\n/;
content = content.replace(hooksRegex, '');

// Remove TagFilter and restore Three Columns Section
content = content.replace(
  /<motion\.div variants=\{itemVariants\}>\s*<TagFilter tags=\{allTags\} selectedTag=\{selectedTag\} onSelectTag=\{setSelectedTag\} \/>\s*<\/motion\.div>\s*\{\/\* Three Columns Section \*\/\}/,
  '{/* Three Columns Section */}'
);

content = content.replace(/items=\{filteredJobs\}/, 'items={JOB_NOTIFICATIONS}');
content = content.replace(/items=\{filteredAdmitCards\}/, 'items={ADMIT_CARDS}');
content = content.replace(/items=\{filteredResults\}/, 'items={RESULTS}');

fs.writeFileSync('src/pages/HomePage.tsx', content);
