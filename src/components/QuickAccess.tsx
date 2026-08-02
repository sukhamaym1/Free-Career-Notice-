import { Briefcase, FileText, Trophy, Newspaper, HelpCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    title: 'Jobs',
    subtitle: 'Latest Notifications',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    link: '/category/job-notifications'
  },
  {
    title: 'Admit Card',
    subtitle: 'Download Hall Ticket',
    icon: <FileText className="w-8 h-8" />,
    color: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    link: '/category/admit-card'
  },
  {
    title: 'Results',
    subtitle: 'Check Results',
    icon: <Trophy className="w-8 h-8" />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    link: '/category/results'
  },
  {
    title: 'Current Affairs',
    subtitle: 'Daily Updates',
    icon: <Newspaper className="w-8 h-8" />,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    link: '/category/current-affairs'
  },
  {
    title: 'Mock Test',
    subtitle: 'Practice Online',
    icon: <HelpCircle className="w-8 h-8" />,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    link: '/quiz'
  },
  {
    title: 'Study Material',
    subtitle: 'Notes & PDFs',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
    link: '/study-material'
  }
];

export default function QuickAccess() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-8 relative z-10">
      <div className="bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 divide-x-0 lg:divide-x lg:divide-slate-200 lg:dark:divide-slate-800">
          {CATEGORIES.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group flex flex-col items-center text-center px-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {item.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
