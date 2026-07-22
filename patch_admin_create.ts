import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

content = content.replace(
  /\{categories\.length > 0 \? categories\.map\(c => \(\s*<option key=\{c\.id\} value=\{c\.slug\}>\{c\.name\}<\/option>\s*\)\) : \(\s*<>\s*<option value="job-notifications">Job Notifications<\/option>\s*<option value="admit-cards">Admit Cards<\/option>\s*<option value="results">Results<\/option>\s*<option value="color-blocks">Color Blocks \(Hero\)<\/option>\s*<\/>\s*\)\}/,
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
