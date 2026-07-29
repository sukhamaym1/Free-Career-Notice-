const fs = require('fs');
let code = fs.readFileSync('src/admin/components/RichTextEditor.tsx', 'utf8');
code = code.replace("extensions: [", "extensions: [ // @ts-ignore\n");
fs.writeFileSync('src/admin/components/RichTextEditor.tsx', code);
console.log("Patched RichTextEditor.tsx");
