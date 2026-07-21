import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';

const HERO_PLACEHOLDERS = [
  "Search SBI PO...",
  "Search SSC CGL...",
  "Search Railway RRB...",
  "Search UPSC...",
  "Search Mock Tests..."
];

export default function Hero() {
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
    <section className="py-12 md:py-20 flex flex-col items-center text-center px-4">
      {/* Live Notice Badge */}
      <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-800 dark:text-orange-400 font-semibold shadow-sm animate-pulse-slow">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
        Live Now: Free Career Notice
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 max-w-3xl">
        Search Latest Jobs, Admit Card & Results
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl relative mb-8 group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 pl-6 pr-16 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all group-hover:shadow-md"
        />
        <button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Trending Tags */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
        <span>Trending:</span>
        {['SBI', 'SSC', 'Railway', 'IBPS'].map(tag => (
          <Link
            key={tag}
            to={`/search?q=${tag}`}
            className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </section>
  );
}
