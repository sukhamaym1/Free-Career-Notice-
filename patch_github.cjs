const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');

const target = `  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {`;
const replacement = `  private owner: string;
  private repo: string;
  private branch: string;
  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/githubProvider.ts', code);
