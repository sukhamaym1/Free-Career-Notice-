const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/PagesPage.tsx', 'utf8');
code = code.replace(/className=\{\\\`/g, "className={`");
code = code.replace(/\\\}\`/g, "}`");
fs.writeFileSync('src/admin/pages/PagesPage.tsx', code);
