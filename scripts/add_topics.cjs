const fs = require('fs');

const content = fs.readFileSync('src/data/triangleQuiz.ts', 'utf-8');
const lines = content.split('\n');

let newLines = [];
let qCount = 0;

for (let line of lines) {
  if (line.trim().startsWith('{q:')) {
    qCount++;
    let topic = 'সাধারণ ত্রিভুজ'; // default
    if (qCount <= 13) topic = 'সমবাহু ত্রিভুজ (Equilateral)';
    else if (qCount <= 20) topic = 'সমকোণী ত্রিভুজ (Right-angled)';
    else if (qCount <= 32) topic = 'সমদ্বিবাহু ত্রিভুজ (Isosceles)';
    else if (qCount <= 47) topic = 'সাধারণ ও বিষমবাহু ত্রিভুজ (Scalene/General)';
    else topic = 'সমদ্বিবাহু সমকোণী ত্রিভুজ (Isosceles Right)';
    
    line = line.replace('}', `,topic:"${topic}"}`);
  }
  newLines.push(line);
}

fs.writeFileSync('src/data/triangleQuiz.ts', newLines.join('\n'));
console.log('Done!');
