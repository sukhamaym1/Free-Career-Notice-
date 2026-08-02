import fs from 'fs';
let content = fs.readFileSync('src/lib/github.ts', 'utf8');

content = content.replace(
  "if (res.status !== 404) {\n        console.error('GitHub API Error body:', errBody);\n      }",
  "if (res.status !== 404 && res.status !== 403) {\n        console.error('GitHub API Error body:', errBody);\n      } else if (res.status === 403 && this.pat) {\n        console.error('GitHub API Error body:', errBody);\n      }"
);

fs.writeFileSync('src/lib/github.ts', content);
