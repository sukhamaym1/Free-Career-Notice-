import fs from 'fs';
let content = fs.readFileSync('src/main.tsx', 'utf-8');
content = content.replace("import App from './App.tsx';", "import App from './App.tsx';\nimport { HelmetProvider } from 'react-helmet-async';");
content = content.replace("<App />", "<HelmetProvider><App /></HelmetProvider>");
fs.writeFileSync('src/main.tsx', content);
