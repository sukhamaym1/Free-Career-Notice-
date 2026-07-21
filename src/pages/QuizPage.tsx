import { FileQuestion, CheckCircle2, Trophy, Clock, Users, ArrowRight } from 'lucide-react';

const MOCK_QUIZZES = [
  {
    id: 1,
    title: 'SSC CGL Tier 1 Mock Test 2026',
    category: 'SSC Exams',
    questions: 100,
    duration: '60 mins',
    participants: '15.2k',
    difficulty: 'Medium',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'RRB NTPC CBT-1 Full Length Test',
    category: 'Railway (RRB)',
    questions: 100,
    duration: '90 mins',
    participants: '22.1k',
    difficulty: 'Medium-Hard',
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'IBPS PO Prelims Booster Quiz',
    category: 'Banking',
    questions: 100,
    duration: '60 mins',
    participants: '18.5k',
    difficulty: 'Hard',
    color: 'bg-indigo-500',
  },
  {
    id: 4,
    title: 'Current Affairs Daily Quiz (21 July)',
    category: 'Current Affairs',
    questions: 20,
    duration: '15 mins',
    participants: '45.8k',
    difficulty: 'Easy',
    color: 'bg-purple-500',
  },
  {
    id: 5,
    title: 'General Science Mini Quiz for Railway',
    category: 'General Science',
    questions: 30,
    duration: '20 mins',
    participants: '12.4k',
    difficulty: 'Medium',
    color: 'bg-pink-500',
  },
  {
    id: 6,
    title: 'UPSC CSE Prelims GS Paper 1 Mock',
    category: 'UPSC / State PSC',
    questions: 100,
    duration: '120 mins',
    participants: '8.9k',
    difficulty: 'Hard',
    color: 'bg-orange-500',
  }
];

export default function QuizPage() {
  return (
    <main className="container mx-auto px-4 py-8 pb-20 animate-in fade-in duration-500 max-w-6xl">
      {/* Header Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <FileQuestion className="w-4 h-4" />
          Free Mock Tests
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Test Your Knowledge
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Practice with our daily updated mock tests and quizzes to boost your exam preparation.
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto rounded-full mt-6"></div>
      </div>

      {/* Stats/Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">5,000+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Daily Active Users</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">100+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">New Quizzes Daily</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">All India</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Live Ranking</div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        Trending Now <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_QUIZZES.map((quiz) => (
          <div key={quiz.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col sm:flex-row">
            {/* Color Accent bar on left */}
            <div className={`w-2 sm:w-3 shrink-0 ${quiz.color}`}></div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {quiz.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {quiz.title}
                </h3>
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <FileQuestion className="w-4 h-4" />
                    <span>{quiz.questions} Qs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{quiz.participants}</span>
                  </div>
                </div>
                
                <a href="#" className={`inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-2.5 rounded-xl text-white font-medium transition-transform active:scale-95 ${quiz.color} hover:brightness-110`}>
                  Start Quiz <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
