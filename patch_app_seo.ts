import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const effectSearch = `// Dynamic Favicon`;

const seoCode = `
    // Dynamic SEO
    if ((SITE_SETTINGS as any).seoTitle) {
      document.title = (SITE_SETTINGS as any).seoTitle;
    } else if ((SITE_SETTINGS as any).siteName) {
      document.title = (SITE_SETTINGS as any).siteName;
    }

    if ((SITE_SETTINGS as any).seoDescription) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', (SITE_SETTINGS as any).seoDescription);
    }

    if ((SITE_SETTINGS as any).seoKeywords) {
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', (SITE_SETTINGS as any).seoKeywords);
    }
`;

content = content.replace(
  `// Dynamic Title\n    if ((SITE_SETTINGS as any).siteName) {\n      document.title = (SITE_SETTINGS as any).siteName;\n    }`,
  seoCode
);

fs.writeFileSync('src/App.tsx', content);
