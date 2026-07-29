import { Users, FileText, Calendar, Award } from 'lucide-react';

export default function FooterStats({ settings }: { settings: any }) {
  let stats = [
    { label: "Happy Users", value: "50K+", icon: "Users", color: "text-emerald-400" },
    { label: "Job Notifications", value: "10K+", icon: "FileText", color: "text-purple-400" },
    { label: "Daily Visitors", value: "5K+", icon: "Calendar", color: "text-amber-400" },
    { label: "Free for Everyone", value: "100%", icon: "Award", color: "text-rose-400" }
  ];

  if (settings.footerStats) {
    try {
      const parsed = typeof settings.footerStats === 'string' ? JSON.parse(settings.footerStats) : settings.footerStats;
      if (Array.isArray(parsed) && parsed.length > 0) {
        stats = parsed.map(s => ({ ...s, color: 'text-blue-400' }));
      }
    } catch (e) {
      // keep default
    }
  }

  const getIcon = (name: string, colorClass: string) => {
    switch (name) {
      case 'Users': return <Users className={`w-8 h-8 ${colorClass}`} />;
      case 'FileText': return <FileText className={`w-8 h-8 ${colorClass}`} />;
      case 'Calendar': return <Calendar className={`w-8 h-8 ${colorClass}`} />;
      case 'Award': return <Award className={`w-8 h-8 ${colorClass}`} />;
      default: return <Award className={`w-8 h-8 ${colorClass}`} />;
    }
  };

  return (
    <div className="border-t border-b border-slate-800 py-10 my-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {stats.map((stat, idx) => (
          <div key={idx} className={`flex items-center gap-4 ${idx > 0 && idx % 2 === 0 ? 'pt-8 md:pt-0' : idx > 0 ? 'pt-8 md:pt-0 pl-0 md:pl-8' : ''} ${idx % 2 !== 0 ? 'pl-4 md:pl-8' : ''}`}>
            {getIcon(stat.icon || 'Award', stat.color || 'text-blue-400')}
            <div>
              <div className="text-2xl font-bold text-white leading-tight">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
