import { useState, useEffect } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

interface AdminPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AdminPage({ theme, toggleTheme }: AdminPageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Check for existing session token
  useEffect(() => {
    const savedToken = localStorage.getItem('cf_jwt_token');
    if (savedToken) {
      setJwtToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    setJwtToken(token);
    localStorage.setItem('cf_jwt_token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setJwtToken(null);
    localStorage.removeItem('cf_jwt_token');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} theme={theme} />;
  }

  // We no longer pass githubConfig, the backend handles deployment/storage
  return (
    <AdminDashboard 
      onLogout={handleLogout} 
      theme={theme} 
      toggleTheme={toggleTheme} 
    />
  );
}
