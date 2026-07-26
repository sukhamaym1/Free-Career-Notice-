import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetImport = `import WebsiteSettings from '../../components/admin/WebsiteSettings';`;
const replacementImport = `import WebsiteSettings from '../../components/admin/WebsiteSettings';
import SEOCalculator from '../../components/admin/SEOCalculator';`;

const targetSEO = `              {/* SEO Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4" /> SEO Settings
                </h4>
                <div>`;

const replacementSEO = `              {/* SEO Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4" /> SEO Settings
                </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Focus Keyword</label>
                  <input name="focusKeyword" defaultValue={editingPost?.focusKeyword || ''} placeholder="e.g. software engineer jobs" className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>`;

const targetAfterSEO = `              {/* Organization */}`;
const replacementAfterSEO = `              {/* SEO Calculator */}
              <SEOCalculator />

              {/* Organization */}`;

if (content.includes(targetImport)) {
  content = content.replace(targetImport, replacementImport);
} else {
  console.log("Import target not found");
}

if (content.includes(targetSEO)) {
  content = content.replace(targetSEO, replacementSEO);
} else {
  console.log("SEO section target not found");
}

if (content.includes(targetAfterSEO)) {
  content = content.replace(targetAfterSEO, replacementAfterSEO);
} else {
  console.log("Organization target not found");
}

// We also need to save focusKeyword when saving the post. Let's patch handleSavePost.
const targetSavePost = `        seoDescription: formData.get('seoDescription'),`;
const replacementSavePost = `        seoDescription: formData.get('seoDescription'),
        focusKeyword: formData.get('focusKeyword'),`;

if (content.includes(targetSavePost)) {
  content = content.replace(targetSavePost, replacementSavePost);
}

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Patched AdminDashboard successfully for SEO Calculator.');
