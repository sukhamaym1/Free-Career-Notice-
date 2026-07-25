import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

content = content.replace(
  "const [searchQuery, setSearchQuery] = useState('');",
  "const [searchQuery, setSearchQuery] = useState('');\n  const [mediaSearchQuery, setMediaSearchQuery] = useState('');"
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
