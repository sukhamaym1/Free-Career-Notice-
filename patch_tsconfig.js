import fs from 'fs';
let content = fs.readFileSync('tsconfig.json', 'utf8');
if (!content.includes('"resolveJsonModule"')) {
  content = content.replace('"allowImportingTsExtensions": true,', '"allowImportingTsExtensions": true,\n    "resolveJsonModule": true,');
  fs.writeFileSync('tsconfig.json', content);
}
