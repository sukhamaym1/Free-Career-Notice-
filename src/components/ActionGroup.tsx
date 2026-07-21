import { MessageCircle, FileQuestion, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActionGroup() {
  return (
    <section className="py-8 px-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
      {/* WhatsApp Button */}
      <a
        href="#"
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-[1.02]"
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <MessageCircle className="w-6 h-6 fill-current" />
        </div>
        Join WhatsApp Channel
      </a>

      {/* Mock Test Button */}
      <Link
        to="/quiz"
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all hover:scale-[1.02]"
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <FileQuestion className="w-6 h-6" />
        </div>
        Free Mock Test & Quiz
      </Link>

      {/* Telegram Button */}
      <a
        href="#"
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all hover:scale-[1.02]"
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <Send className="w-6 h-6 fill-current" />
        </div>
        Join Telegram Channel
      </a>
    </section>
  );
}
