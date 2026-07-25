import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetText = `<td colSpan={4} className="py-12 text-center text-slate-500">
                      No media files found in public/uploads/
                    </td>`;

const replacementText = `<td colSpan={4} className="py-12 text-center text-slate-500">
                      {mediaFiles.length === 0 ? 'No media files found in public/uploads/' : 'No media files match your search.'}
                    </td>`;

content = content.replace(targetText, replacementText);
fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
