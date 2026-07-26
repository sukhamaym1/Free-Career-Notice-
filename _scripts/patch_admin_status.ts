import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetStatus = `<td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                      <span className={cn("px-2 py-1 rounded text-xs text-white", job.status === 'draft' ? "bg-amber-500" : "bg-emerald-500")}>
                        {job.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                    </td>`;

const replacementStatus = `<td className="py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                      <span className={cn("px-2 py-1 rounded text-xs text-white", 
                        job.status === 'draft' ? "bg-amber-500" : 
                        (job.date && new Date(job.date) > new Date() ? "bg-blue-500" : "bg-emerald-500")
                      )}>
                        {job.status === 'draft' ? 'Draft' : (job.date && new Date(job.date) > new Date() ? 'Scheduled' : 'Published')}
                      </span>
                    </td>`;

content = content.replace(targetStatus, replacementStatus);
fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Replaced status display successfully.');
