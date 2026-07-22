import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLogin: (token: string, repo: string, branch: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [pat, setPat] = useState('');
  const [repo, setRepo] = useState('https://github.com/sukhamaym1/Needful-Calculator');
  const [branch, setBranch] = useState('main');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pat && repo && branch) {
      onLogin(pat, repo, branch);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1e293b] rounded-2xl shadow-xl overflow-hidden border border-slate-700/50"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-full mb-4 flex items-center justify-center">
              {/* Replace with actual logo if needed */}
              <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Needful CMS Admin</h1>
            <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-400 text-center">
              Securely login to manage your GitHub repository blog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                GitHub Personal Access Token (PAT)
              </label>
              <input
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
              <p className="text-xs text-slate-400 mt-2">
                Must have 'repo' permissions to push files. Token is only saved locally in this tab session and never permanently.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                GitHub Repository URL / Path
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Target Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform active:scale-[0.98]"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
