/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import TextPage from './pages/TextPage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';

import PostPage from './pages/PostPage';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Handle mock link clicks for the demo
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      // Only mock links with href="#" 
      if (link && link.getAttribute('href') === '#') {
        e.preventDefault();
        const text = link.innerText.trim() || 'Link';
        setToast(`Navigating to: ${text.substring(0, 40)}${text.length > 40 ? '...' : ''}`);
        
        // Hide toast after 3 seconds
        setTimeout(() => setToast(null), 3000);
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/:pageId" element={<TextPage />} />
      </Routes>

      <Footer />

      {/* Global Toast Notification for Demo */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

