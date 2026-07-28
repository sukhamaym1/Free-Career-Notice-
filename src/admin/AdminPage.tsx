import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface AdminPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AdminPage({ theme, toggleTheme }: AdminPageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pat, setPat] = useState('');

  // Check for existing session token
  useEffect(() => {
    const savedSession = sessionStorage.getItem('github_cms_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.pat) {
          setPat(parsed.pat);
          setIsLoggedIn(true);
        }
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  const handleLogin = (newPat: string) => {
    setPat(newPat);
    sessionStorage.setItem('github_cms_session', JSON.stringify({ pat: newPat }));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPat('');
    sessionStorage.removeItem('github_cms_session');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} theme={theme} />;
  }

  return (
    <AdminDashboard 
      onLogout={handleLogout} 
      pat={pat}
      theme={theme} 
      toggleTheme={toggleTheme} 
    />
  );
}
