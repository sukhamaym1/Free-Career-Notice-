const text = `
| Action | Link |
| ------------------------ | ------------------------ |
| Check SSC MTS Result 2026 | SSC Result Section |
`;
const isMarkdownTable = /\|.*\|\s*\n\s*\|[\s\-:]+\|/.test(text);
console.log("is table:", isMarkdownTable);
