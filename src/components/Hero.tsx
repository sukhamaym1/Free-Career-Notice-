import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';
import { useData } from './DataProvider';
import AnimatedBackground from './AnimatedBackground';

const HERO_PLACEHOLDERS = [
  "Search SSC CGL...",
  "Search Railway NTPC...",
  "Search IBPS PO...",
  "Search WBPSC...",
  "Search SSC GD...",
  "Search Banking Jobs...",
  "Search Admit Cards...",
  "Search Latest Results...",
  "Search Current Affairs..."
];

export default function Hero() {
  const { SITE_SETTINGS } = useData();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const placeholder = useTypingPlaceholder(HERO_PLACEHOLDERS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-20 flex flex-col items-center text-center px-4 overflow-hidden rounded-3xl mb-8">
      <AnimatedBackground />

      {/* Content wrapper with higher z-index to appear above background */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Live Notice Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-[#0f172a]/60 border border-slate-700/50  text-slate-200 text-sm font-medium shadow-sm transition-transform hover:scale-105">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-orange-400">Live Now:</span> Free Career Notice – Stay Updated!
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          Your <span className="text-blue-600 dark:text-blue-400">Career</span> Updates,<br />
          All in One Place
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl font-medium leading-relaxed">
          Latest Government Jobs, Admit Cards, Results, Current Affairs <br className="hidden md:block" />
          & Exam Resources — Updated Daily.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl relative mb-10 group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={query ? "" : placeholder}
            className="w-full h-16 pl-16 pr-32 rounded-full border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900  text-slate-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all"
          >
            Search
          </button>
        </form>

        {/* Trending Searches */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
          <span className="text-slate-500 dark:text-slate-400 mr-2">Trending Searches:</span>
          {['SSC CGL', 'SSC GD', 'Railway NTPC', 'IBPS PO', 'WBPSC'].map(tag => (
            <Link
              key={tag}
              to={`/search?q=${tag}`}
              className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50  text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-500/30 transition-all hover:scale-105"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
