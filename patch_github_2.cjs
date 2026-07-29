const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');

const target = `  private owner: string;
  private repo: string;
  private branch: string;
  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;`;

const replacement = `  private owner: string;
  private repo: string;
  private branch: string;
  private contentRoot: string;
  private uploadsRoot: string;
  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.contentRoot = contentRoot;
    this.uploadsRoot = uploadsRoot;`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/githubProvider.ts', code);
