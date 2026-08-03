import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Monitor, Smartphone } from 'lucide-react';
import { useData } from '../../components/DataProvider';

export default function SEOCalculator() {
  const { SITE_SETTINGS } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [slug, setSlug] = useState('');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  useEffect(() => {
    const interval = setInterval(() => {
      const mainTitleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
      const seoTitleInput = document.querySelector('input[name="seoTitle"]') as HTMLInputElement;
      const descInput = document.querySelector('textarea[name="seoDescription"]') as HTMLTextAreaElement;
      const contentInput = document.getElementById('editor-content') as HTMLInputElement;
      const keywordInput = document.querySelector('input[name="focusKeyword"]') as HTMLInputElement;
      const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;

      setTitle(seoTitleInput?.value || mainTitleInput?.value || '');
      setDescription(descInput?.value || '');
      setSlug(slugInput?.value || 'your-post-url');
      
      // Strip HTML tags from content
      const rawContent = contentInput?.value || '';
      const strippedContent = rawContent.replace(/<[^>]+>/g, ' ');
      setContent(strippedContent);
      
      setFocusKeyword(keywordInput?.value || '');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  let checks = [];
  let passedChecks = 0;
  let totalChecks = 4;
  const keyword = focusKeyword.toLowerCase().trim();
  
  // Check 1: Title Length
  if (title.length === 0) {
    checks.push({ text: 'Title is empty', passed: false, type: 'error' });
  } else if (title.length < 30) {
    checks.push({ text: 'Title is too short (aim for 50-60 chars)', passed: false, type: 'warning' });
  } else if (title.length > 60) {
    checks.push({ text: 'Title is too long (over 60 chars)', passed: false, type: 'warning' });
  } else {
    checks.push({ text: 'Title length is optimal', passed: true, type: 'success' });
    passedChecks++;
  }

  // Check 2: Description Length
  if (description.length === 0) {
    checks.push({ text: 'Meta description is missing', passed: false, type: 'error' });
  } else if (description.length < 120) {
    checks.push({ text: 'Meta description is too short (aim for 150-160 chars)', passed: false, type: 'warning' });
  } else if (description.length > 160) {
    checks.push({ text: 'Meta description is too long (over 160 chars)', passed: false, type: 'warning' });
  } else {
    checks.push({ text: 'Meta description length is optimal', passed: true, type: 'success' });
    passedChecks++;
  }

  // Check 3: Focus Keyword in Title
  if (!keyword) {
    checks.push({ text: 'Set a focus keyword', passed: false, type: 'error' });
  } else if (title.toLowerCase().includes(keyword)) {
    checks.push({ text: 'Focus keyword found in title', passed: true, type: 'success' });
    passedChecks++;
  } else {
    checks.push({ text: 'Focus keyword not found in title', passed: false, type: 'error' });
  }

  // Check 4: Content Word Count & Keyword Density
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 300) {
    checks.push({ text: `Content is too short (${wordCount} words). Aim for 300+`, passed: false, type: 'warning' });
  } else {
    passedChecks++;
    checks.push({ text: `Content length is good (${wordCount} words)`, passed: true, type: 'success' });
  }

  if (keyword && wordCount > 0) {
    totalChecks++;
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    const density = (count / wordCount) * 100;
    
    if (count === 0) {
      checks.push({ text: 'Focus keyword not found in content', passed: false, type: 'error' });
    } else if (density < 0.5) {
      checks.push({ text: `Keyword density is low (${density.toFixed(1)}%)`, passed: false, type: 'warning' });
    } else if (density > 2.5) {
      checks.push({ text: `Keyword density is high (${density.toFixed(1)}%). Avoid keyword stuffing`, passed: false, type: 'warning' });
    } else {
      passedChecks++;
      checks.push({ text: `Keyword density is optimal (${density.toFixed(1)}%)`, passed: true, type: 'success' });
    }
  }

  const score = Math.round((passedChecks / totalChecks) * 100) || 0;
  
  let scoreColor = 'text-red-500';
  if (score >= 80) scoreColor = 'text-green-500';
  else if (score >= 50) scoreColor = 'text-amber-500';

  const siteName = (SITE_SETTINGS as any)?.siteName || 'Free Career Notice';
  const siteUrl = (SITE_SETTINGS as any)?.socialWebsite || 'free-career-notice.pages.dev';

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white">SEO Score</h4>
          <span className={`text-2xl font-bold ${scoreColor}`}>{score}/100</span>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
          <div className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
        </div>

        <div className="space-y-2">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              {check.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />}
              {check.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
              {check.type === 'error' && <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
              <span className="text-slate-700 dark:text-slate-300">{check.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white">Google Search Preview</h4>
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            <button 
              onClick={(e) => { e.preventDefault(); setPreviewMode('mobile'); }}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${previewMode === 'mobile' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); setPreviewMode('desktop'); }}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${previewMode === 'desktop' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`bg-white dark:bg-[#202124] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-sans overflow-hidden ${previewMode === 'desktop' ? 'p-5' : 'max-w-[375px] mx-auto p-4'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500">{siteName.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#202124] dark:text-[#dadce0] leading-tight">{siteName}</span>
              <div className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-tight flex items-center">
                https://{siteUrl} <span className="mx-1.5 text-xs">›</span> {slug}
              </div>
            </div>
          </div>
          
          <div className="text-[20px] leading-[1.3] text-[#1a0dab] dark:text-[#8ab4f8] cursor-pointer hover:underline mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {title || 'Your Post Title Here'}
          </div>
          
          <div className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-[1.58] line-clamp-2">
            {description || 'Provide a meta description to see how it will appear in search results. A good description is concise and contains your focus keyword.'}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">Preview is approximate and may vary based on Google's actual rendering.</p>
      </div>
    </div>
  );
}
