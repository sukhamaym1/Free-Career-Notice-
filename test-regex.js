const text = `
| Action | Link |
| ------------------------ | ------------------------ |
| Check SSC MTS Result 2026 | SSC Result Section |
`;
console.log(/\|.*\|\s*\n\s*\|[\s\-:]+\|/.test(text));
