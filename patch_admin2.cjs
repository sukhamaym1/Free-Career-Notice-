const fs = require('fs');
let content = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

const regex = /handleDeletePost=\{handleDeletePost\} \/\/.*?\}\}/s;
content = content.replace(regex, 'handleDeletePost={handleDeletePost}');

fs.writeFileSync('src/admin/AdminDashboard.tsx', content);
