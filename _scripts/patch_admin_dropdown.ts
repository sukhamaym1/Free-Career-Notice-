import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

// Compute filter options
const filterOptionsCode = `
  const filterOptions = [...categories];
  Array.from(new Set(rawPosts.map(p => p.categorySlug).filter(Boolean))).forEach((slug: any) => {
    if (!filterOptions.find(c => c.slug === slug)) {
      const name = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      filterOptions.push({ id: slug, slug, name });
    }
  });
`;

content = content.replace(
  /const filteredPosts = rawPosts\.filter/,
  `${filterOptionsCode}\n\n  const filteredPosts = rawPosts.filter`
);

content = content.replace(
  /\{categories\.length > 0 \? categories\.map\(c => \(\s*<option key=\{c\.id\} value=\{c\.slug\}>\{c\.name\}<\/option>\s*\)\) : \(\s*<>\s*<option value="job-notifications">Job Notifications<\/option>\s*<option value="admit-cards">Admit Cards<\/option>\s*<option value="results">Results<\/option>\s*<option value="color-blocks">Highlight Updates<\/option>\s*<\/>\s*\)\}/,
  `{filterOptions.length > 0 ? filterOptions.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                )) : (
                  <>
                    <option value="job-notifications">Job Notifications</option>
                    <option value="admit-cards">Admit Cards</option>
                    <option value="results">Results</option>
                    <option value="color-blocks">Highlight Updates</option>
                  </>
                )}`
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
