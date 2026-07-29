import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function FooterContact({ settings }: { settings: any }) {
  return (
    <div>
      <h3 className="text-white font-bold text-base md:text-lg mb-5 flex items-center gap-2 uppercase tracking-wide">
        <Phone className="w-5 h-5 text-blue-500" />
        CONTACT INFO
      </h3>
      <ul className="space-y-4 text-sm text-slate-400">
        <li className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{settings.contactAddress || 'New Delhi, India - 110001'}</span>
        </li>
        <li className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-500 shrink-0" />
          <a href={`mailto:${settings.contactEmail || 'support@freecareernotice.com'}`} className="hover:text-white transition-colors">
            {settings.contactEmail || 'support@freecareernotice.com'}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-blue-500 shrink-0" />
          <a href={`tel:${settings.contactPhone || '+919876543210'}`} className="hover:text-white transition-colors">
            {settings.contactPhone || '+91 9876543210'}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{settings.workingHours || 'Mon - Sat: 9:00 AM - 6:00 PM\n(Sunday Closed)'}</span>
        </li>
      </ul>
    </div>
  );
}
