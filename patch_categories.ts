import fs from 'fs';

const categories = [
  { id: "cat_1", name: "Job Notifications", slug: "job-notifications" },
  { id: "cat_2", name: "Admit Cards", slug: "admit-cards" },
  { id: "cat_3", name: "Results", slug: "results" },
  { id: "cat_4", name: "Highlight Updates", slug: "color-blocks" }
];

fs.writeFileSync('content/categories.json', JSON.stringify(categories, null, 2));
