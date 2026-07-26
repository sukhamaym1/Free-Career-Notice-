import fs from 'fs';

const content = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf-8');

// Replace the categoryConfig with a dynamic filter
const newContent = content.replace(
  `import { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } from '../data';`,
  `import { PUBLISHED_POSTS } from '../data';`
).replace(
  /const categoryConfig: Record[\s\S]*?if \(categoryId && categoryConfig\[categoryId\]\) \{[\s\S]*?\} else \{[\s\S]*?\}/m,
  `
  title = categoryId ? categoryId.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()) : 'Category';
  let baseItems = PUBLISHED_POSTS.filter(p => p.categorySlug === categoryId);
  
  if (categoryId === 'job-notifications') {
    items = baseItems.filter((job) => {
      if (filters.salary && job.salary !== filters.salary) return false;
      if (filters.jobType && job.jobType !== filters.jobType) return false;
      if (filters.location && job.location !== filters.location) return false;
      return true;
    });
  } else {
    items = baseItems;
  }
  `
);
fs.writeFileSync('src/pages/CategoryPage.tsx', newContent);
