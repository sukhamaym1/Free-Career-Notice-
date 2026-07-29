import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Focus from '@tiptap/extension-focus';
import { Extension } from '@tiptap/core';
import { cn } from '../../lib/utils';
import { FileCode2, Save } from 'lucide-react';

import { 
  CustomImage, Iframe, Details, Summary, Callout, ActionButton, Timeline, TimelineItem,
  Table, TableRow, TableCell, TableHeader,
  TaskList, TaskItem, Youtube,
  Underline, Highlight, TextAlign,
  Superscript, Subscript, CharacterCount,
  Dropcursor, Typography, Placeholder, Link
} from './editor/Extensions';
import { EditorToolbar } from './editor/EditorToolbar';
import { EditorBubbleMenu, EditorFloatingMenu } from './editor/FloatingAndBubbleMenus';
import { EditorFooter } from './editor/EditorFooter';

interface RichTextEditorProps {
  isFocusMode?: boolean;
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const CustomShortcuts = Extension.create({
  name: 'customShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        const previousUrl = this.editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return true;
        if (url === '') {
          this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return true;
        }
        this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        return true;
      },
    }
  }
});

export default function RichTextEditor({ content, onChange, placeholder, isFocusMode }: RichTextEditorProps) {
  const [isRawMode, setIsRawMode] = useState(false);
  const [rawContent, setRawContent] = useState(content);
  const [saved, setSaved] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [ // @ts-ignore

      CustomShortcuts,
      Focus.configure({
        className: 'has-focus',
        mode: 'deepest',
      }),
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        dropcursor: false,
      }),
      CustomImage, Iframe, Details, Summary, Callout, ActionButton, Timeline, TimelineItem,
      Table.configure({ resizable: true }), TableRow, TableCell, TableHeader,
      TaskList, TaskItem.configure({ nested: true }), Youtube,
      Underline, Highlight.configure({ multicolor: true }), 
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Superscript, Subscript, 
      CharacterCount, Dropcursor, Typography, 
      Placeholder.configure({ placeholder: placeholder || 'Write something amazing...' }), 
      Link.configure({ openOnClick: false, autolink: true })
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setSaved(false);
      
      // Auto save indicator
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        setSaved(true);
      }, 1000);
    },
    editorProps: {
      attributes: {
        class: `prose prose-slate sm:prose lg:prose-lg xl:prose-xl focus:outline-none dark:prose-invert max-w-none min-h-[500px] p-6 editor-content ${isFocusMode ? 'focus-mode-active' : ''}`,
      },
    },
  });

  // Sync raw content when entering raw mode
  useEffect(() => {
    if (isRawMode && editor) {
      setRawContent(editor.getHTML());
    }
  }, [isRawMode, editor]);

  // Update onChange when rawContent changes in raw mode
  useEffect(() => {
    if (isRawMode) {
      onChange(rawContent);
    }
  }, [rawContent, isRawMode]);
    
  // Sync editor when exiting raw mode
  useEffect(() => {
    if (!isRawMode && editor && editor.getHTML() !== rawContent) {
      editor.commands.setContent(rawContent);
    }
  }, [isRawMode, editor]);

  // Update raw content when content prop changes from outside
  useEffect(() => {
    if (content !== rawContent && !isRawMode) {
      setRawContent(content);
      if (editor && editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [content]);

  useEffect(() => {
    const handleRestore = (e: any) => {
      if (editor) {
        editor.commands.setContent(e.detail);
        setRawContent(e.detail);
        onChange(e.detail);
      }
    };
    window.addEventListener("restore-editor-content", handleRestore);
    return () => window.removeEventListener("restore-editor-content", handleRestore);
  }, [editor, onChange]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all relative overflow-visible">
      
      {!isRawMode && <EditorToolbar editor={editor} />}
      {!isRawMode && <EditorBubbleMenu editor={editor} />}
      {!isRawMode && <EditorFloatingMenu editor={editor} />}
      
      {isRawMode && (
        <div className="border-b border-slate-200 dark:border-slate-800 p-3 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <FileCode2 className="w-4 h-4" /> HTML Source Code
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-[500px] relative">
        {isRawMode ? (
          <textarea
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            className="w-full h-full min-h-[500px] p-6 bg-slate-900 text-green-400 font-mono text-sm resize-y focus:outline-none"
            placeholder="<p>Paste your HTML here...</p>"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl px-2">
        <div className="flex-1">
          {!isRawMode && <EditorFooter editor={editor} />}
        </div>
        
        <div className="flex items-center gap-4 py-2 pr-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-[80px] justify-end">
            {saved ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Save className="w-3.5 h-3.5" /> Saved</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">Saving...</span>
            )}
          </div>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
          <button
            type="button"
            onClick={() => setIsRawMode(!isRawMode)}
            className={cn(
              "px-3 py-1.5 rounded flex items-center gap-2 text-xs font-medium transition-colors",
              isRawMode 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
            title="Toggle HTML Mode"
          >
            <FileCode2 className="w-3.5 h-3.5" /> {isRawMode ? "Exit HTML" : "HTML Mode"}
          </button>
        </div>
      </div>

    </div>
  );
}
