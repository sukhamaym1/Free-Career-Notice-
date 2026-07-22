const fs = require('fs');
const content = fs.readFileSync('src/data.ts', 'utf8');
const scriptContent = content.replace(/export const/g, 'var');
const parsed = new Function(scriptContent + '\nreturn { NEW_UPDATES, COLOR_BLOCKS, JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS };')();
console.log(Object.keys(parsed));
console.log(parsed.JOB_NOTIFICATIONS.length);
