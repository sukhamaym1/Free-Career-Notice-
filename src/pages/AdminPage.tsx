import { useState, useEffect } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

interface AdminPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AdminPage({ theme, toggleTheme }: AdminPageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [githubConfig, setGithubConfig] = useState({
    pat: '',
    repo: '',
    branch: ''
  });

  // Basic session persistence
  useEffect(() => {
    const savedSession = sessionStorage.getItem('admin_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setGithubConfig(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  const handleLogin = (pat: string, repo: string, branch: string) => {
    const config = { pat, repo, branch };
    setGithubConfig(config);
    sessionStorage.setItem('admin_session', JSON.stringify(config));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGithubConfig({ pat: '', repo: '', branch: '' });
    sessionStorage.removeItem('admin_session');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} githubConfig={githubConfig} theme={theme} toggleTheme={toggleTheme} />;
}
