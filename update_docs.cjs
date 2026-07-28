const fs = require('fs');

const docs = [
  'PROJECT_STRUCTURE.md', 'ARCHITECTURE.md', 'CHANGELOG.md', 
  'API_DOCUMENTATION.md', 'ADMIN_GUIDE.md', 'SYSTEM_RULES.md', 
  'ROADMAP.md', 'README.md'
];

docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    fs.appendFileSync(doc, `\n\n## Dual-Repository Migration\n\nThis project now uses a dual-repository architecture. The Website Repository (this one) contains the source code, while all user-generated content (posts, images, settings) is stored in an external Content Repository via the configured Storage Provider in \`src/config.ts\`. This prevents content loss during AI Studio updates. Admin Panel communicates with the Content Service.\n`);
  } else {
    fs.writeFileSync(doc, `# ${doc.replace('.md', '')}\n\n## Dual-Repository Architecture\n\nThis project uses a dual-repository architecture. The Website Repository contains the source code, while all user-generated content (posts, images, settings) is stored in an external Content Repository via the configured Storage Provider in \`src/config.ts\`.\n`);
  }
});
