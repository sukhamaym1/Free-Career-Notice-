const fs = require('fs');

let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');
const target = `  private owner: string;
  private repo: string;
  private branch: string;
  constructor(pat: string, owner: string, repo: string, branch: string, private contentRoot: string, private uploadsRoot: string) {`;
const replacement = `  private owner: string;
  private repo: string;
  private branch: string;
  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {`;
code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/githubProvider.ts', code);
