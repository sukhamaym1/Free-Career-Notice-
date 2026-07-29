const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/PagesPage.tsx', 'utf8');
code = code.replace("alert('Failed to save page.');", "alert('Failed to save page: ' + (err.message || String(err)));");
fs.writeFileSync('src/admin/pages/PagesPage.tsx', code);
