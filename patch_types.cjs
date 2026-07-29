const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/types.ts', 'utf8');

const target = `  // Menu (for completeness based on prompt)
  getMenu(): Promise<any>;
  saveMenu(menu: any): Promise<void>;`;

const replacement = `  // Menu (for completeness based on prompt)
  getMenu(): Promise<any>;
  saveMenu(menu: any): Promise<void>;

  // Pages
  getPages(): Promise<Record<string, string>>;
  getPage(id: string): Promise<string | null>;
  savePage(id: string, content: string): Promise<void>;`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/types.ts', code);
