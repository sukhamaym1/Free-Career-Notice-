const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/contentService.ts', 'utf8');
code = code.replace("throw new Error('Failed to save page.');", "throw error;");
fs.writeFileSync('src/lib/storage/contentService.ts', code);
