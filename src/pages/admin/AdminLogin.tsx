import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, Loader2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminLoginProps {
  onLogin: (token: string) => void;
  theme: 'light' | 'dark';
}

export default function AdminLogin({ onLogin, theme }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to Cloudflare Worker
      // In production, this will hit POST /api/auth/login
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation for demo
      if (email === 'admin@example.com' && password === 'admin') {
        const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token';
        onLogin(mockJwt);
      } else {
        setError('Invalid email or password. Use admin@example.com / admin');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-200",
      theme === 'dark' ? "bg-[#0f172a]" : "bg-slate-50"
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full max-w-md rounded-2xl shadow-xl overflow-hidden border",
          theme === 'dark' ? "bg-[#1e293b] border-slate-700/50" : "bg-white border-slate-200"
        )}
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className={cn(
              "w-16 h-16 rounded-full mb-4 flex items-center justify-center shadow-inner",
              theme === 'dark' ? "bg-slate-800" : "bg-blue-50 text-blue-600"
            )}>
              <KeyRound className={cn("w-8 h-8", theme === 'dark' ? "text-blue-500" : "text-blue-600")} />
            </div>
            <h1 className={cn("text-2xl font-bold mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>
              Free Career Notice
            </h1>
            <h2 className={cn("text-lg font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
              Admin Portal
            </h2>
            <p className={cn("text-sm text-center mt-2", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
              Sign in securely to manage content
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? "text-slate-200" : "text-slate-700")}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={cn(
                    "w-full border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    theme === 'dark' 
                      ? "bg-[#0f172a] border-slate-700 text-slate-200 placeholder:text-slate-500" 
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                  )}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? "text-slate-200" : "text-slate-700")}>
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    theme === 'dark' 
                      ? "bg-[#0f172a] border-slate-700 text-slate-200 placeholder:text-slate-500" 
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                  )}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
