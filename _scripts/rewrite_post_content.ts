import fs from 'fs';

const content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

// The content area starts at <div className="prose ..."> and ends before </div> </div> {/* Sidebar */}
// Let's use regex to replace it
const startTag = '<div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500">';
const sidebarStart = '{/* Sidebar */}';

const startIndex = content.indexOf(startTag);
const sidebarIndex = content.indexOf(sidebarStart);

if (startIndex !== -1 && sidebarIndex !== -1) {
  // We want to replace from startIndex to sidebarIndex with our dangerouslySetInnerHTML div
  const before = content.substring(0, startIndex);
  const after = content.substring(sidebarIndex);
  
  // We need to keep the div closing tag before sidebarIndex
  // Actually let's just replace the div entirely
  const replaceWith = `<div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500" dangerouslySetInnerHTML={{ __html: post.content || '' }} />\n          </div>\n          `;
  
  const newContent = before + replaceWith + after;
  fs.writeFileSync('src/pages/PostPage.tsx', newContent);
}

