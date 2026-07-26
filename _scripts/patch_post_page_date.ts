import fs from 'fs';
let content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

content = content.replace(
  "<span>{post.date}</span>",
  "<span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>"
);

fs.writeFileSync('src/pages/PostPage.tsx', content);
console.log('Replaced PostPage.tsx date successfully.');
