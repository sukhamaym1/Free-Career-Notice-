import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

// Add imports
content = content.replace(
  /import \{ JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS \} from '\.\.\/data';/,
  "import { useState, useMemo } from 'react';\nimport { PUBLISHED_POSTS, JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } from '../data';\nimport TagFilter from '../components/TagFilter';"
);

// Add hooks and logic
const hooksCode = `
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PUBLISHED_POSTS.forEach((p: any) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!selectedTag) return JOB_NOTIFICATIONS;
    return JOB_NOTIFICATIONS.filter((item: any) => item.tags && item.tags.includes(selectedTag));
  }, [selectedTag]);

  const filteredAdmitCards = useMemo(() => {
    if (!selectedTag) return ADMIT_CARDS;
    return ADMIT_CARDS.filter((item: any) => item.tags && item.tags.includes(selectedTag));
  }, [selectedTag]);

  const filteredResults = useMemo(() => {
    if (!selectedTag) return RESULTS;
    return RESULTS.filter((item: any) => item.tags && item.tags.includes(selectedTag));
  }, [selectedTag]);
`;

content = content.replace(
  /export default function HomePage\(\) \{/,
  'export default function HomePage() {' + hooksCode
);

// Add TagFilter and replace props in ListSections
content = content.replace(
  /\{.*?Three Columns Section.*?\}/,
  `
      <motion.div variants={itemVariants}>
        <TagFilter tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
      </motion.div>
      {/* Three Columns Section */}
  `
);

content = content.replace(/items=\{JOB_NOTIFICATIONS\}/, 'items={filteredJobs}');
content = content.replace(/items=\{ADMIT_CARDS\}/, 'items={filteredAdmitCards}');
content = content.replace(/items=\{RESULTS\}/, 'items={filteredResults}');

fs.writeFileSync('src/pages/HomePage.tsx', content);
