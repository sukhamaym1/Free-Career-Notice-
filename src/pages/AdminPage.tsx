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

  // Check for existing session token
  useEffect(() => {
    const savedSession = sessionStorage.getItem('github_cms_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.pat && parsed.repo && parsed.branch) {
          setGithubConfig(parsed);
          setIsLoggedIn(true);
        }
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  const handleLogin = (pat: string, repo: string, branch: string) => {
    const config = { pat, repo, branch };
    setGithubConfig(config);
    sessionStorage.setItem('github_cms_session', JSON.stringify(config));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGithubConfig({ pat: '', repo: '', branch: '' });
    sessionStorage.removeItem('github_cms_session');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} theme={theme} />;
  }

  return (
    <AdminDashboard 
      onLogout={handleLogout} 
      githubConfig={githubConfig}
      theme={theme} 
      toggleTheme={toggleTheme} 
    />
  );
}
