const fs = require('fs');
let code = fs.readFileSync('src/admin/components/WebsiteSettings.tsx', 'utf8');

const targetFooterSettings = `<h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Footer Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Logo URL</label>
                    <input name="footerLogo" value={formData.footerLogo || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Description</label>
                    <textarea name="footerDescription" rows={3} value={formData.footerDescription || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quick Links (JSON Array of {label, url})</label>
                    <textarea name="quickLinks" rows={3} value={formData.quickLinks || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Useful Links (JSON Array of {label, url})</label>
                    <textarea name="usefulLinks" rows={3} value={formData.usefulLinks || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>`;

const replaceFooterSettings = `<h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Footer Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Logo URL</label>
                    <input name="footerLogo" value={formData.footerLogo || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Description</label>
                    <textarea name="footerDescription" rows={3} value={formData.footerDescription || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <input type="checkbox" name="enableNewsletter" checked={formData.enableNewsletter || false} onChange={handleInputChange} className="rounded text-blue-600" />
                        Enable Newsletter Section
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Newsletter Heading</label>
                      <input name="newsletterHeading" value={formData.newsletterHeading || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Newsletter Description</label>
                      <input name="newsletterDescription" value={formData.newsletterDescription || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quick Links (JSON Array of {label, url})</label>
                      <textarea name="quickLinks" rows={4} value={formData.quickLinks || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Categories (JSON Array of {label, url})</label>
                      <textarea name="footerCategories" rows={4} value={formData.footerCategories || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Important Pages (JSON Array of {label, url})</label>
                      <textarea name="importantPages" rows={4} value={formData.importantPages || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Useful Tools (JSON Array of {label, url})</label>
                      <textarea name="usefulTools" rows={4} value={formData.usefulTools || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Statistics Bar (JSON Array of {label, value, icon})</label>
                    <textarea name="footerStats" rows={3} value={formData.footerStats || ''} onChange={handleInputChange} placeholder='[{"label":"Monthly Visitors","value":"100K+","icon":"Users"}]' className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <input type="checkbox" name="enableBackToTop" checked={formData.enableBackToTop !== false} onChange={handleInputChange} className="rounded text-blue-600" />
                        Enable Back To Top Button
                      </label>
                    </div>
                  </div>`;

code = code.replace(targetFooterSettings, replaceFooterSettings);
fs.writeFileSync('src/admin/components/WebsiteSettings.tsx', code);
console.log("Admin panel settings updated");
