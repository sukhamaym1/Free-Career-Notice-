const fs = require('fs');

// Fix githubProvider.ts
let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');
const target = `  private owner: string;
  private repo: string;
  private branch: string;
  private contentRoot: string;
  private uploadsRoot: string;
  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {`;
const replacement = `  private owner: string;
  private repo: string;
  private branch: string;
  constructor(pat: string, owner: string, repo: string, branch: string, private contentRoot: string, private uploadsRoot: string) {`;
code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/githubProvider.ts', code);

// Fix AdminDashboard.tsx
let adminCode = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');
const adminTarget = `const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const updated = {
      siteName: fd.get('siteName') || '',
      description: fd.get('description') || '',
      seoTitle: fd.get('seoTitle') || '',
      keywords: fd.get('keywords') || '',
      googleAnalyticsId: fd.get('googleAnalyticsId') || '',
      publisherId: fd.get('publisherId') || ''
    };`;
const adminReplacement = `const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const updated = {
      siteName: String(fd.get('siteName') || ''),
      description: String(fd.get('description') || ''),
      seoTitle: String(fd.get('seoTitle') || ''),
      keywords: String(fd.get('keywords') || ''),
      googleAnalyticsId: String(fd.get('googleAnalyticsId') || ''),
      publisherId: String(fd.get('publisherId') || '')
    };`;
adminCode = adminCode.replace(adminTarget, adminReplacement);

// Also there might be another one in AdminDashboard for settings
const adminTarget2 = `const updated = {
      siteName: fd.get('siteName'),
      description: fd.get('description'),
      seoTitle: fd.get('seoTitle'),
      keywords: fd.get('keywords'),
      googleAnalyticsId: fd.get('googleAnalyticsId'),
      publisherId: fd.get('publisherId')
    };`;
adminCode = adminCode.replace(adminTarget2, adminReplacement);

fs.writeFileSync('src/admin/AdminDashboard.tsx', adminCode);
