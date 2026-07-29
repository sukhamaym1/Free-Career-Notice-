const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/PagesPage.tsx', 'utf8');
code = code.replace(/\\\$\\\{/g, "${"); // wait, backslashes were \$\{. Let's just do it carefully.
code = code.replace("\\${", "${");
code = code.replace("\\}", "}");
code = code.replace("\\`}", "`}"); // in case I messed it up above
fs.writeFileSync('src/admin/pages/PagesPage.tsx', code);
