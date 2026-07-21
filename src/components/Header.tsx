import React, { useState } from 'react';
import { Moon, Sun, GraduationCap, ChevronDown, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';

const SEARCH_PLACEHOLDERS = [
  "Search SBI PO...",
  "Search SSC CGL...",
  "Search Railway RRB...",
  "Search UPSC...",
  "Search Mock Tests..."
];

function HeaderSearch() {
  const placeholder = useTypingPlaceholder(SEARCH_PLACEHOLDERS);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hidden lg:flex relative group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-56 xl:w-72 h-10 pl-10 pr-4 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-700"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-0 bottom-0 my-auto" />
    </form>
  );
}

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="font-bold text-xl leading-none tracking-tight text-gray-900 dark:text-white">
            Free Career <br />
            <span className="text-green-600 dark:text-green-500">Notice</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/category/job-notifications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Job Notifications</Link>
          <Link to="/category/admit-card" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admit Card</Link>
          <Link to="/category/results" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Results</Link>
          <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            More <ChevronDown className="w-4 h-4" />
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <HeaderSearch />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
