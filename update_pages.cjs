const fs = require('fs');

function replaceInData(filePath, variables) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import {[^}]+} from '(\.\.\/)*data';\n?/, `import { useData } from '${filePath.includes('/pages/') || filePath.includes('/components/') ? '../' : './'}components/DataProvider';\n`);
  
  // Find export default function XYZ() {
  const funcRegex = /export default function ([A-Za-z0-9_]+)\([^)]*\) {/;
  const match = content.match(funcRegex);
  if (match) {
    const replacement = `${match[0]}\n  const { ${variables.join(', ')} } = useData();`;
    content = content.replace(match[0], replacement);
  }
  fs.writeFileSync(filePath, content);
}

replaceInData('src/pages/HomePage.tsx', ['JOB_NOTIFICATIONS', 'ADMIT_CARDS', 'RESULTS']);
replaceInData('src/pages/SearchPage.tsx', ['JOB_NOTIFICATIONS', 'ADMIT_CARDS', 'RESULTS']);
replaceInData('src/pages/CategoryPage.tsx', ['JOB_NOTIFICATIONS', 'ADMIT_CARDS', 'RESULTS']);
replaceInData('src/pages/PostPage.tsx', ['PUBLISHED_POSTS']);
replaceInData('src/pages/TextPage.tsx', ['PUBLISHED_POSTS']);
replaceInData('src/components/ColorfulGrid.tsx', ['COLOR_BLOCKS']);
replaceInData('src/components/Header.tsx', ['SITE_SETTINGS']);
replaceInData('src/components/Footer.tsx', ['SITE_SETTINGS']);
