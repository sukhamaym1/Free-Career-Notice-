import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');
content = content.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(''\);\n  const \[categoryFilter, setCategoryFilter\] = useState\(''\);\n  const \[categoryFilter, setCategoryFilter\] = useState\(''\);/,
  "const [searchQuery, setSearchQuery] = useState('');\n  const [categoryFilter, setCategoryFilter] = useState('');"
);
fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
