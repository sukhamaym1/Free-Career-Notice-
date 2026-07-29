import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface LinkGroup {
  title: string;
  icon?: React.ReactNode;
  links: { label: string; url: string }[];
  defaultLinks: { label: string; url: string }[];
}

export default function FooterLinks({ title, icon, links, defaultLinks }: LinkGroup) {
  let finalLinks = defaultLinks;

  if (links) {
    try {
      const parsed = typeof links === 'string' ? JSON.parse(links) : links;
      if (Array.isArray(parsed) && parsed.length > 0) {
        finalLinks = parsed;
      }
    } catch (e) {
      // Keep defaults
    }
  }

  return (
    <div>
      <h3 className="text-white font-bold text-base md:text-lg mb-5 flex items-center gap-2 uppercase tracking-wide">
        {icon && <span className="text-blue-500">{icon}</span>}
        {title}
      </h3>
      <ul className="space-y-3">
        {finalLinks.map((link, idx) => (
          <li key={idx}>
            <Link 
              to={link.url} 
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
            >
              <ChevronRight className="w-3.5 h-3.5 text-blue-500/50 group-hover:text-blue-400 transition-colors shrink-0" />
              <span className="truncate">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
