import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('import { SITE_SETTINGS }')) {
  content = content.replace(
    `import { useTheme } from './hooks/useTheme';`,
    `import { useTheme } from './hooks/useTheme';\nimport { SITE_SETTINGS } from './data';`
  );
  
  const effectCode = `
  useEffect(() => {
    // Dynamic Favicon
    if ((SITE_SETTINGS as any).faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = (SITE_SETTINGS as any).faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = (SITE_SETTINGS as any).faviconUrl;
        document.head.appendChild(newLink);
      }
    }
    
    // Dynamic Title
    if ((SITE_SETTINGS as any).siteName) {
      document.title = (SITE_SETTINGS as any).siteName;
    }
  }, []);
  `;
  
  content = content.replace(
    `  const [toast, setToast] = useState<string | null>(null);`,
    `  const [toast, setToast] = useState<string | null>(null);\n${effectCode}`
  );
}

fs.writeFileSync('src/App.tsx', content);
