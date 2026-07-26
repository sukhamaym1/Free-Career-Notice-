import fs from 'fs';

let content = fs.readFileSync('src/components/ListSection.tsx', 'utf-8');

// Use a regular expression to match and replace the metadata block
content = content.replace(
  /\{isObj && \(item\.salary \|\| item\.jobType \|\| item\.location\) && \([\s\S]*?<\/div>\s*\)\}/,
  ''
);

fs.writeFileSync('src/components/ListSection.tsx', content);
