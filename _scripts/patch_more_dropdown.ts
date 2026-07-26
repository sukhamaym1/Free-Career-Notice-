import fs from 'fs';

let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

const moreDropdownCode = `
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">
              More <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full right-0 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
              <Link to="/category/answer-keys" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400">Answer Keys</Link>
              <Link to="/category/syllabus" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400">Syllabus & Pattern</Link>
              <Link to="/category/ssc-exams" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400">SSC Exams</Link>
              <Link to="/category/banking" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400">Banking Jobs</Link>
            </div>
          </div>
`;

content = content.replace(
  /<button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">\s*More <ChevronDown className="w-4 h-4" \/>\s*<\/button>/g,
  moreDropdownCode
);

fs.writeFileSync('src/components/Header.tsx', content);
