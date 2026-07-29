import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Send } from 'lucide-react';

export default function FooterSocial({ settings }: { settings: any }) {
  if (settings.showSocialIconsInFooter === false) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-bold text-lg">FOLLOW US</h3>
        <p className="text-sm text-slate-400">Stay connected with us on social media.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {settings.socialTelegram && (
          <a href={settings.socialTelegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#0088cc]/20" aria-label="Telegram">
            <Send className="w-5 h-5 -ml-0.5" />
          </a>
        )}
        {settings.socialWhatsAppChannel && (
          <a href={settings.socialWhatsAppChannel} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#25D366]/20" aria-label="WhatsApp">
            <MessageCircle className="w-5 h-5" />
          </a>
        )}
        {settings.socialYouTube && (
          <a href={settings.socialYouTube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#FF0000]/20" aria-label="YouTube">
            <Youtube className="w-5 h-5" />
          </a>
        )}
        {settings.socialFacebook && (
          <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#1877F2]/20" aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </a>
        )}
        {settings.socialInstagram && (
          <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-pink-500/20" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {settings.socialXTwitter && (
          <a href={settings.socialXTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black border border-slate-700 flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="X (Twitter)">
            <Twitter className="w-4 h-4" />
          </a>
        )}
        {settings.socialLinkedIn && (
          <a href={settings.socialLinkedIn} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#0A66C2]/20" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}
