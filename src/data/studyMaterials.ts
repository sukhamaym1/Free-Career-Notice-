export const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case 'UPSC': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
    case 'SSC': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    case 'Banking': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
    case 'Railway': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
    case 'Current Affairs': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400';
    case 'English': return 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

export const STUDY_MATERIALS = [
  {
    id: '1',
    title: 'Indian Polity by M. Laxmikanth - Summary Notes',
    category: 'UPSC',
    fileSize: '2.4 MB',
    pages: 145,
    downloads: '12k+',
    date: '2026-08-01',
    color: 'from-orange-500 to-red-600',
    description: 'Comprehensive summary notes of Indian Polity by M. Laxmikanth, perfect for UPSC civil services preparation.',
    author: 'Sukhamay'
  },
  {
    id: '2',
    title: 'SSC CGL Tier 1 Previous Year Papers (2018-2023)',
    category: 'SSC',
    fileSize: '5.1 MB',
    pages: 320,
    downloads: '45k+',
    date: '2026-07-29',
    isUpdated: true,
    color: 'from-blue-500 to-indigo-600',
    description: 'A complete collection of SSC CGL Tier 1 previous year papers from 2018 to 2023 with answer keys.',
    author: 'Sukhamay'
  },
  {
    id: '3',
    title: 'Quantitative Aptitude Formula Cheat Sheet',
    category: 'Banking',
    fileSize: '1.2 MB',
    pages: 12,
    downloads: '8k+',
    date: '2024-04-10',
    color: 'from-green-500 to-emerald-600',
    description: 'Quick revision cheat sheet containing all essential quantitative aptitude formulas for banking exams.',
    author: 'Sukhamay'
  },
  {
    id: '4',
    title: 'RRB NTPC General Science Revision Notes',
    category: 'Railway',
    fileSize: '3.5 MB',
    pages: 85,
    downloads: '22k+',
    date: '2024-01-20',
    color: 'from-purple-500 to-fuchsia-600',
    description: 'Detailed revision notes for General Science specifically tailored for Railway RRB NTPC examinations.',
    author: 'Sukhamay'
  },
  {
    id: '5',
    title: 'Daily Current Affairs PDF - March 2024',
    category: 'Current Affairs',
    fileSize: '4.8 MB',
    pages: 64,
    downloads: '15k+',
    date: '2024-04-01',
    color: 'from-cyan-500 to-blue-600',
    description: 'Monthly compilation of daily current affairs for March 2024, highly relevant for all competitive exams.',
    author: 'Sukhamay'
  },
  {
    id: '6',
    title: 'English Vocabulary (1000+ words) for SSC/Banking',
    category: 'English',
    fileSize: '2.1 MB',
    pages: 45,
    downloads: '18k+',
    date: '2024-03-05',
    color: 'from-pink-500 to-rose-600',
    description: 'A curated list of the most frequent English vocabulary words asked in SSC and Banking exams.',
    author: 'Sukhamay'
  }
];
