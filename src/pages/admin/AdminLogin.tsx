import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, Loader2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminLoginProps {
  onLogin: (pat: string, repo: string, branch: string) => void;
  theme: 'light' | 'dark';
}

export default function AdminLogin({ onLogin, theme }: AdminLoginProps) {
  const [pat, setPat] = useState('');
  const [repo, setRepo] = useState('username/repo');
  const [branch, setBranch] = useState('main');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pat && repo && branch) {
      onLogin(pat, repo, branch);
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
              GitHub CMS Admin
            </h2>
            <p className={cn("text-sm text-center mt-2", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
              Login using your GitHub Personal Access Token (PAT). Token is stored only in session storage.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? "text-slate-200" : "text-slate-700")}>
                GitHub PAT
              </label>
              <input
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className={cn(
                  "w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                  theme === 'dark' 
                    ? "bg-[#0f172a] border-slate-700 text-slate-200 placeholder:text-slate-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                )}
                required
              />
            </div>
            
            <div>
              <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? "text-slate-200" : "text-slate-700")}>
                Repository (owner/repo)
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="username/free-career-notice"
                className={cn(
                  "w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                  theme === 'dark' 
                    ? "bg-[#0f172a] border-slate-700 text-slate-200 placeholder:text-slate-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                )}
                required
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1.5", theme === 'dark' ? "text-slate-200" : "text-slate-700")}>
                Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className={cn(
                  "w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                  theme === 'dark' 
                    ? "bg-[#0f172a] border-slate-700 text-slate-200 placeholder:text-slate-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
                )}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
