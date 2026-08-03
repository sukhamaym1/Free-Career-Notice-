import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
  </svg>
);

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
            <TelegramIcon className="w-5 h-5 -ml-0.5" />
          </a>
        )}
        {settings.socialWhatsAppChannel && (
          <a href={settings.socialWhatsAppChannel} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#25D366]/20" aria-label="WhatsApp">
            <WhatsAppIcon className="w-5 h-5" />
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
