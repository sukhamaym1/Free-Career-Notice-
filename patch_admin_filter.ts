import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

// Add categoryFilter state
content = content.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
  "const [searchQuery, setSearchQuery] = useState('');\n  const [categoryFilter, setCategoryFilter] = useState('');"
);

// Update filteredPosts
content = content.replace(
  /const filteredPosts = rawPosts\.filter\(p => \s*p\.title\?\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\|\s*p\.categorySlug\?\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\s*\);/,
  `const filteredPosts = rawPosts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.categorySlug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? p.categorySlug === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });`
);

// Add the dropdown UI in "All Posts"
content = content.replace(
  /<div className="p-6 border-b border-slate-200 dark:border-slate-700\/50 flex justify-between items-center">\s*<h3 className="text-lg font-bold text-slate-900 dark:text-white">All Posts<\/h3>\s*<button onClick=\{\(\) => \{ setEditingPost\(null\); setActiveTab\('Create Post'\); \}\} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">\s*\+ Add New\s*<\/button>\s*<\/div>/,
  `<div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Posts</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.length > 0 ? categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                )) : (
                  <>
                    <option value="job-notifications">Job Notifications</option>
                    <option value="admit-cards">Admit Cards</option>
                    <option value="results">Results</option>
                    <option value="color-blocks">Highlight Updates</option>
                  </>
                )}
              </select>
              <button onClick={() => { setEditingPost(null); setActiveTab('Create Post'); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap">
                + Add New
              </button>
            </div>
          </div>`
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
