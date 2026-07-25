import fs from 'fs';

let content = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf-8');

const newImports = `import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, 
  Undo, Redo, Link as LinkIcon, ImageIcon,
  Palette, FileCode2
} from 'lucide-react';
import { cn } from '../../lib/utils';`;

content = content.replace(/import React, { useEffect } from 'react';[\s\S]*?import { cn } from '\.\.\/\.\.\/lib\/utils';/, newImports);

const targetMenuBar = `const MenuBar = ({ editor }: { editor: any }) => {`;
const replacementMenuBar = `const MenuBar = ({ editor, isRawMode, setIsRawMode }: { editor: any, isRawMode: boolean, setIsRawMode: (v: boolean) => void }) => {
  if (isRawMode) {
    return (
      <div className="border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg justify-end">
        <button
          type="button"
          onClick={() => setIsRawMode(false)}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-blue-600 dark:text-blue-400 bg-slate-200 dark:bg-slate-700 font-medium flex items-center gap-2 text-sm"
        >
          <FileCode2 className="w-4 h-4" /> Exit HTML Mode
        </button>
      </div>
    );
  }
`;

content = content.replace(targetMenuBar, replacementMenuBar);

const targetUndoRedo = `      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};`;

const replacementUndoRedo = `      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 my-auto mx-1" />
      
      <div className="relative flex items-center">
        <input
          type="color"
          onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer absolute opacity-0"
          title="Text Color"
        />
        <Button title="Text Color">
          <Palette className="w-4 h-4" style={{ color: editor.getAttributes('textStyle').color || 'currentColor' }} />
        </Button>
      </div>

      <div className="flex-1" />
      <button
        type="button"
        onClick={() => setIsRawMode(true)}
        className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-2 text-sm"
        title="Edit Raw HTML"
      >
        <FileCode2 className="w-4 h-4" /> HTML
      </button>

    </div>
  );
};`;

content = content.replace(targetUndoRedo, replacementUndoRedo);

const targetRichTextEditor = `export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
    ],`;

const replacementRichTextEditor = `export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isRawMode, setIsRawMode] = useState(false);
  const [rawContent, setRawContent] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
    ],`;

content = content.replace(targetRichTextEditor, replacementRichTextEditor);

const targetReturn = `  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0f172a] overflow-hidden flex flex-col">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );`;

const replacementReturn = `  // Sync raw content when entering raw mode
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
    setRawContent(content);
  }, [content]);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0f172a] overflow-hidden flex flex-col">
      <MenuBar editor={editor} isRawMode={isRawMode} setIsRawMode={setIsRawMode} />
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 min-h-[250px] relative">
        {isRawMode ? (
          <textarea
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            className="w-full h-full min-h-[250px] p-4 bg-slate-900 text-green-400 font-mono text-sm resize-y focus:outline-none"
            placeholder="<p>Paste your HTML here...</p>"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );`;

content = content.replace(targetReturn, replacementReturn);

fs.writeFileSync('src/components/admin/RichTextEditor.tsx', content);
console.log('Patched RTE!');
