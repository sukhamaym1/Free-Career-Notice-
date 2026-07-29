const fs = require('fs');

let adminCode = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

const adminTarget = `      const updated = {
        siteName: formData.get('siteName'),
        description: formData.get('description'),
        seoTitle: formData.get('seoTitle'),
        keywords: formData.get('keywords'),
        googleAnalyticsId: formData.get('googleAnalyticsId'),
        publisherId: formData.get('publisherId')
      };`;
const adminReplacement = `      const updated = {
        siteName: String(formData.get('siteName') || ''),
        description: String(formData.get('description') || ''),
        seoTitle: String(formData.get('seoTitle') || ''),
        keywords: String(formData.get('keywords') || ''),
        googleAnalyticsId: String(formData.get('googleAnalyticsId') || ''),
        publisherId: String(formData.get('publisherId') || '')
      };`;
adminCode = adminCode.replace(adminTarget, adminReplacement);

fs.writeFileSync('src/admin/AdminDashboard.tsx', adminCode);
