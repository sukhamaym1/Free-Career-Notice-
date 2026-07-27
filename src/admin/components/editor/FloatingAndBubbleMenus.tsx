import React from 'react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon,
  Heading1, Heading2, Quote, Code, Type, MessageSquareWarning, ChevronRight, Hash, Link2, ImageIcon, Table, LayoutTemplate, 
  Minus, FileDown,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const EditorBubbleMenu = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors", editor.isActive('bold') && "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
      ><Bold className="w-4 h-4" /></button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors", editor.isActive('italic') && "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
      ><Italic className="w-4 h-4" /></button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors", editor.isActive('underline') && "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
      ><UnderlineIcon className="w-4 h-4" /></button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrikethrough().run()}
        className={cn("p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors", editor.isActive('strike') && "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
      ><Strikethrough className="w-4 h-4" /></button>
      <div className="w-px bg-slate-200 dark:bg-slate-700 my-1"></div>
      <button
        type="button"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          if (url === null) return;
          if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={cn("p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors", editor.isActive('link') && "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
      ><LinkIcon className="w-4 h-4" /></button>
    </BubbleMenu>
  );
};

export const EditorFloatingMenu = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <FloatingMenu editor={editor} className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-1.5 transition-opacity">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
      ><Heading2 className="w-4 h-4 text-slate-400" /> H2</button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
      ><Hash className="w-4 h-4 text-slate-400" /> H3</button>

      <button
        type="button"
        onClick={() => editor.chain().focus().insertContent({ type: 'callout', attrs: { type: 'info' }, content: [{ type: 'paragraph' }] }).run()}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
      ><MessageSquareWarning className="w-4 h-4 text-slate-400" /> Callout</button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
      ><Minus className="w-4 h-4 text-slate-400" /> Divider</button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().insertContent({ type: 'actionButton', attrs: { text: 'Apply Now', type: 'primary' } }).run()}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
      ><Link2 className="w-4 h-4 text-slate-400" /> Button</button>
    </FloatingMenu>
  );
};
