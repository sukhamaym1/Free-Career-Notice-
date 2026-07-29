const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');

const replacement = `    await this.putWithRetry(
      \`\${this.contentRoot}/pages/\${id}.json\`,
      JSON.stringify({ content }, null, 2),
      \`Update page \${id}\`,
      sha,
      (newSha) => { this.pageShaMap.set(id, newSha); }
    );`;

code = code.replace(/await this\.saveWithRetry\([\s\S]*?this\.pageShaMap\.delete\(id\);/g, replacement);

fs.writeFileSync('src/lib/storage/githubProvider.ts', code);
