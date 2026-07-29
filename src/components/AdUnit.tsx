import { useData } from './DataProvider';

export default function AdUnit({ position }: { position: 'header' | 'sidebar' | 'footer' | 'sticky' }) {
  const { SITE_SETTINGS } = useData();
  const settings = SITE_SETTINGS as any;

  if (!settings.enableAds) return null;

  let adCode = '';
  switch (position) {
    case 'header':
      adCode = settings.headerAdCode;
      break;
    case 'sidebar':
      adCode = settings.sidebarAdCode;
      break;
    case 'footer':
      adCode = settings.footerAdCode;
      break;
    case 'sticky':
      adCode = settings.stickyMobileAdCode;
      break;
  }

  if (!adCode) return null;

  return (
    <div
      className={`ad-container ad-position-${position} my-4 flex justify-center`}
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
}
