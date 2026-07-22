import fs from 'fs';

let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Use regex to replace SITE_SETTINGS.someProperty with (SITE_SETTINGS as any).someProperty
content = content.replace(/SITE_SETTINGS\.siteName/g, '(SITE_SETTINGS as any).siteName');
content = content.replace(/SITE_SETTINGS\.footerDescription/g, '(SITE_SETTINGS as any).footerDescription');
content = content.replace(/SITE_SETTINGS\.contactAddress/g, '(SITE_SETTINGS as any).contactAddress');
content = content.replace(/SITE_SETTINGS\.contactPhone/g, '(SITE_SETTINGS as any).contactPhone');
content = content.replace(/SITE_SETTINGS\.contactEmail/g, '(SITE_SETTINGS as any).contactEmail');
content = content.replace(/SITE_SETTINGS\.footerCopyrightText/g, '(SITE_SETTINGS as any).footerCopyrightText');

fs.writeFileSync('src/components/Footer.tsx', content);
