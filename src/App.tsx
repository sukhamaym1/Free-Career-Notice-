/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from './hooks/useTheme';
import { useData } from './components/DataProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import TextPage from './pages/TextPage';
import SearchPage from './pages/SearchPage';
import QuizPage from './pages/QuizPage';
import SitemapPage from './pages/SitemapPage';
import AdminPage from './admin/AdminPage';

import PostPage from './pages/PostPage';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';

import StudyMaterialPage from './pages/StudyMaterialPage';
import StudyMaterialDetailPage from './pages/StudyMaterialDetailPage';

export default function App() {
  const { SITE_SETTINGS, loading } = useData();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

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
    
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setToast(customEvent.detail.message);
      setTimeout(() => setToast(null), 3000);
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('show-toast', handleCustomToast);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('show-toast', handleCustomToast);
    };
  }, [SITE_SETTINGS]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${isAdmin ? 'bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white' : 'bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100'}`}>
      <Helmet>
        <title>{(SITE_SETTINGS as any).seoTitle || (SITE_SETTINGS as any).siteName || 'Free Career Notice'}</title>
        {(SITE_SETTINGS as any).seoDescription && <meta name="description" content={(SITE_SETTINGS as any).seoDescription} />}
        {(SITE_SETTINGS as any).seoKeywords && <meta name="keywords" content={(SITE_SETTINGS as any).seoKeywords} />}
        {(SITE_SETTINGS as any).faviconUrl && <link rel="icon" type="image/x-icon" href={(SITE_SETTINGS as any).faviconUrl} />}
        <meta property="og:site_name" content={(SITE_SETTINGS as any).siteName || 'Free Career Notice'} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "${(SITE_SETTINGS as any).siteName || 'Free Career Notice'}",
              "url": "https://${(SITE_SETTINGS as any).socialWebsite || 'free-career-notice.pages.dev'}/"
            }
          `}
        </script>
      </Helmet>
      <ScrollToTop />
      {!isAdmin && <Header theme={theme} toggleTheme={toggleTheme} />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/study-material" element={<StudyMaterialPage />} />
        <Route path="/study-material/:id" element={<StudyMaterialDetailPage />} />
        <Route path="/admin" element={<AdminPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/:pageId" element={<TextPage />} />
      </Routes>

      {!isAdmin && <Footer />}

      {!isAdmin && <BackToTop />}

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

