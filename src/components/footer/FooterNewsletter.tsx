import { Mail } from 'lucide-react';
import { useState } from 'react';

export default function FooterNewsletter({ settings }: { settings: any }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    // Simulated API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{settings.newsletterHeading || 'WEEKLY CAREER ALERTS'}</h3>
          <p className="text-sm text-slate-400">{settings.newsletterDescription || 'Sign up for weekly career update alerts and never miss an opportunity.'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={status !== 'idle'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
