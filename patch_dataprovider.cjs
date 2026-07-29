const fs = require('fs');
let code = fs.readFileSync('src/components/DataProvider.tsx', 'utf8');

const target1 = `  SITE_SETTINGS: SiteSettings;
}`;
const replacement1 = `  SITE_SETTINGS: SiteSettings;
  STATIC_PAGES: Record<string, string>;
}`;
code = code.replace(target1, replacement1);

const target2 = `    return { ...processed, SITE_SETTINGS: fallbackSettings as SiteSettings };
  });`;
const replacement2 = `    return { ...processed, SITE_SETTINGS: fallbackSettings as SiteSettings, STATIC_PAGES: {} };
  });`;
code = code.replace(target2, replacement2);

const target3 = `        const [posts, settings] = await Promise.all([
          contentService.getPosts(),
          contentService.getSettings()
        ]);`;
const replacement3 = `        const [posts, settings, pages] = await Promise.all([
          contentService.getPosts(),
          contentService.getSettings(),
          contentService.getPages ? contentService.getPages() : Promise.resolve({})
        ]);`;
code = code.replace(target3, replacement3);

const target4 = `          setData({ ...processed, SITE_SETTINGS: { ...(fallbackSettings as SiteSettings), ...(settings || {}) } });`;
const replacement4 = `          setData({ ...processed, SITE_SETTINGS: { ...(fallbackSettings as SiteSettings), ...(settings || {}) }, STATIC_PAGES: pages || {} });`;
code = code.replace(target4, replacement4);

fs.writeFileSync('src/components/DataProvider.tsx', code);
