import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetImport = `  LayoutTemplate, Users, Activity, Trash2, Link as LinkIcon, DownloadCloud
} from 'lucide-react';`;

const replacementImport = `  LayoutTemplate, Users, Activity, Trash2, Link as LinkIcon, DownloadCloud, Image
} from 'lucide-react';`;

if (content.includes(targetImport)) {
  content = content.replace(targetImport, replacementImport);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Added Image to lucide-react import');
} else {
  console.log('Could not find targetImport');
}
