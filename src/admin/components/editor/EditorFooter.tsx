import React from 'react';
import { Type, Image as ImageIcon, Table as TableIcon, Clock } from 'lucide-react';

export const EditorFooter = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();
  
  // Calculate reading time (avg 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200) || 1;
  
  // Count specific nodes
  let imageCount = 0;
  let tableCount = 0;
  
  editor.state.doc.descendants((node: any) => {
    if (node.type.name === 'image') imageCount++;
    if (node.type.name === 'table') tableCount++;
  });

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 p-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1" title="Words">
          <Type className="w-3 h-3" /> {wordCount} words
        </span>
        <span title="Characters">
          {charCount} chars
        </span>
        <span className="flex items-center gap-1" title="Reading Time">
          <Clock className="w-3 h-3" /> {readingTime} min read
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1" title="Images">
          <ImageIcon className="w-3 h-3" /> {imageCount}
        </span>
        <span className="flex items-center gap-1" title="Tables">
          <TableIcon className="w-3 h-3" /> {tableCount}
        </span>
      </div>
    </div>
  );
};
