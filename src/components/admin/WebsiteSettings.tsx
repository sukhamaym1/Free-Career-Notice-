import { useState } from 'react';
import type { FormEvent } from 'react';
import { Save, RefreshCw, Download, Upload } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function WebsiteSettings({ 
  siteSettings, 
  setSiteSettings, 
  settingsSha, 
  setSettingsSha, 
  client, 
  setSyncStatus 
}: any) {
  const [activeTab, setActiveTab] = useState('General');
  
  const tabs = [
    'General', 'Social Media', 'SEO', 'Static Pages', 
    'Homepage', 'Footer', 'Contact', 'Advertisement', 'Backup'
  ];

  const [formData, setFormData] = useState<any>(siteSettings || {});
  const [selectedStaticPage, setSelectedStaticPage] = useState('about-us');

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStaticPageChange = (content: string) => {
    setFormData((prev: any) => ({
      ...prev,
      staticPages: {
        ...(prev.staticPages || {}),
        [selectedStaticPage]: content
      }
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSyncStatus('syncing');
    try {
      const res = await client.putFile('content/settings.json', JSON.stringify(formData, null, 2), 'Update website settings', settingsSha || undefined);
      setSettingsSha(res.content?.sha);
      setSiteSettings(formData);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setFormData(json);
        alert('Settings imported successfully! Please click Save to apply them.');
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if(confirm('Are you sure you want to reset to default settings?')) {
      setFormData({});
    }
  };

  const staticPagesList = [
    { id: 'about-us', name: 'About Us' },
    { id: 'contact-us', name: 'Contact Us' },
    { id: 'privacy-policy', name: 'Privacy Policy' },
    { id: 'terms-and-conditions', name: 'Terms & Conditions' },
    { id: 'disclaimer', name: 'Disclaimer' },
    { id: 'dmca', name: 'DMCA' },
    { id: 'cookie-policy', name: 'Cookie Policy' },
    { id: 'editorial-policy', name: 'Editorial Policy' },
    { id: 'correction-policy', name: 'Correction Policy' }
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <form onSubmit={handleSave} className="space-y-6">
            
            {activeTab === 'General' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website Name</label>
                    <input name="siteName" value={formData.siteName || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website Tagline</label>
                    <input name="siteTagline" value={formData.siteTagline || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logo URL</label>
                    <input name="logoUrl" value={formData.logoUrl || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Favicon URL</label>
                    <input name="faviconUrl" value={formData.faviconUrl || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Email</label>
                    <input name="primaryEmail" type="email" value={formData.primaryEmail || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Support Email</label>
                    <input name="supportEmail" type="email" value={formData.supportEmail || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <textarea name="address" rows={2} value={formData.address || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Copyright Text</label>
                    <input name="copyrightText" value={formData.copyrightText || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Text</label>
                    <textarea name="footerText" rows={2} value={formData.footerText || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Social Media' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Social Media Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Facebook', 'WhatsApp Channel', 'WhatsApp Group', 'Telegram', 'YouTube', 'Instagram', 'X (Twitter)', 'LinkedIn', 'GitHub', 'Website'].map(social => {
                    const fieldName = `social${social.replace(/[^a-zA-Z0-9]/g, '')}`;
                    return (
                      <div key={social}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{social} URL</label>
                        <input name={fieldName} value={formData[fieldName] || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'SEO' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">SEO Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default SEO Title</label>
                    <input name="seoTitle" value={formData.seoTitle || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Meta Description</label>
                    <textarea name="seoDescription" rows={3} value={formData.seoDescription || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Keywords</label>
                    <input name="seoKeywords" value={formData.seoKeywords || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google Search Console Verification</label>
                      <input name="seoGoogleVerify" value={formData.seoGoogleVerify || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bing Verification</label>
                      <input name="seoBingVerify" value={formData.seoBingVerify || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google Analytics ID</label>
                      <input name="googleAnalyticsId" value={formData.googleAnalyticsId || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google Tag Manager ID</label>
                      <input name="gtmId" value={formData.gtmId || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">robots.txt Content</label>
                    <textarea name="robotsTxt" rows={4} value={formData.robotsTxt || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ads.txt Content</label>
                    <textarea name="adsTxt" rows={4} value={formData.adsTxt || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Static Pages' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Static Pages Content</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {staticPagesList.map(page => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setSelectedStaticPage(page.id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedStaticPage === page.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      {page.name}
                    </button>
                  ))}
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white flex justify-between items-center">
                      Editing: {staticPagesList.find(p => p.id === selectedStaticPage)?.name}
                    </h4>
                  </div>
                  <div className="bg-white dark:bg-slate-900">
                    <RichTextEditor 
                      content={formData.staticPages?.[selectedStaticPage] || ''} 
                      onChange={handleStaticPageChange} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Homepage' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Homepage Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Homepage Hero Title</label>
                    <input name="heroTitle" value={formData.heroTitle || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Description</label>
                    <textarea name="heroDescription" rows={3} value={formData.heroDescription || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Button Text</label>
                    <input name="heroButtonText" value={formData.heroButtonText || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Button Link</label>
                    <input name="heroButtonLink" value={formData.heroButtonLink || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Featured Categories (comma separated slugs)</label>
                    <input name="featuredCategories" value={formData.featuredCategories || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Homepage Announcement (HTML allowed)</label>
                    <textarea name="homepageAnnouncement" rows={2} value={formData.homepageAnnouncement || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Homepage Banner URL</label>
                    <input name="homepageBanner" value={formData.homepageBanner || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <input type="checkbox" name="enableHomepagePopup" checked={formData.enableHomepagePopup || false} onChange={handleInputChange} className="rounded text-blue-600" />
                      Enable Homepage Popup
                    </label>
                  </div>
                  {formData.enableHomepagePopup && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Popup Content (HTML allowed)</label>
                      <textarea name="homepagePopupContent" rows={3} value={formData.homepagePopupContent || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Footer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Footer Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Logo URL</label>
                    <input name="footerLogo" value={formData.footerLogo || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Description</label>
                    <textarea name="footerDescription" rows={3} value={formData.footerDescription || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quick Links (JSON Array of &#123;label, url&#125;)</label>
                    <textarea name="quickLinks" rows={3} value={formData.quickLinks || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Useful Links (JSON Array of &#123;label, url&#125;)</label>
                    <textarea name="usefulLinks" rows={3} value={formData.usefulLinks || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <input type="checkbox" name="showSocialIconsInFooter" checked={formData.showSocialIconsInFooter !== false} onChange={handleInputChange} className="rounded text-blue-600" />
                        Show Social Icons in Footer
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Copyright Text</label>
                    <input name="footerCopyrightText" value={formData.footerCopyrightText || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Developer Credit HTML</label>
                    <input name="developerCredit" value={formData.developerCredit || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Contact' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                    <input name="contactEmail" value={formData.contactEmail || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                    <input name="contactPhone" value={formData.contactPhone || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number</label>
                    <input name="contactWhatsApp" value={formData.contactWhatsApp || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telegram Support Username</label>
                    <input name="contactTelegram" value={formData.contactTelegram || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Office Address</label>
                    <textarea name="contactAddress" rows={2} value={formData.contactAddress || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google Map Embed Code (HTML iframe)</label>
                    <textarea name="googleMapEmbed" rows={3} value={formData.googleMapEmbed || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Working Hours</label>
                    <input name="workingHours" value={formData.workingHours || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Advertisement' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Advertisement Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <input type="checkbox" name="enableAds" checked={formData.enableAds || false} onChange={handleInputChange} className="rounded text-blue-600" />
                      Enable Advertisements Globally
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google AdSense Publisher ID</label>
                    <input name="adsenseId" value={formData.adsenseId || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white" placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <input type="checkbox" name="enableAutoAds" checked={formData.enableAutoAds || false} onChange={handleInputChange} className="rounded text-blue-600" />
                      Enable Auto Ads
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Header Ad Code</label>
                    <textarea name="headerAdCode" rows={3} value={formData.headerAdCode || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sidebar Ad Code</label>
                    <textarea name="sidebarAdCode" rows={3} value={formData.sidebarAdCode || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Ad Code</label>
                    <textarea name="footerAdCode" rows={3} value={formData.footerAdCode || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sticky Mobile Ad Code</label>
                    <textarea name="stickyMobileAdCode" rows={3} value={formData.stickyMobileAdCode || ''} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white font-mono text-sm" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Backup' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Backup & Restore</h3>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-2">Export Settings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Download all current website settings as a JSON file.</p>
                  <button type="button" onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4" /> Export Settings
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-2">Import Settings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Upload a previously exported settings JSON file. (Click Save below after importing)</p>
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors cursor-pointer w-fit">
                    <Upload className="w-4 h-4" /> Choose File
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 dark:text-red-400/80 mb-4">Reset all settings to default empty values. This cannot be undone.</p>
                  <button type="button" onClick={handleReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Reset to Default
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'Backup' && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
