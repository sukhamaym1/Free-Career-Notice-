import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function SEOCalculator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const mainTitleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
      const seoTitleInput = document.querySelector('input[name="seoTitle"]') as HTMLInputElement;
      const descInput = document.querySelector('textarea[name="seoDescription"]') as HTMLTextAreaElement;
      const contentInput = document.getElementById('editor-content') as HTMLInputElement;
      const keywordInput = document.querySelector('input[name="focusKeyword"]') as HTMLInputElement;

      setTitle(seoTitleInput?.value || mainTitleInput?.value || '');
      setDescription(descInput?.value || '');
      
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
    const regex = new RegExp(keyword.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'gi');
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

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900 dark:text-white">SEO Score</h4>
        <span className={`text-2xl font-bold ${scoreColor}`}>{score}/100</span>
      </div>
      
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
      </div>

      <div className="space-y-2 mt-4">
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
  );
}
