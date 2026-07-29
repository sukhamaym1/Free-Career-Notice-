const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');
code = code.replace("if (err.status === 409) {", "if (err.status === 409 || err.status === 422) {");
code = code.replace("if (err.status === 409) {", "if (err.status === 409 || err.status === 422) {");
fs.writeFileSync('src/lib/storage/githubProvider.ts', code);
