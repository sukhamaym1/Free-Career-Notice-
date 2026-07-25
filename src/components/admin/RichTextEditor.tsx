import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, 
  Undo, Redo, Link as LinkIcon, ImageIcon,
  Palette, FileCode2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, isRawMode, setIsRawMode }: { editor: any, isRawMode: boolean, setIsRawMode: (v: boolean) => void }) => {
  useEffect(() => {
    const handleRestore = (e: any) => {
      if (editor) {
        editor.commands.setContent(e.detail);
      }
    };
    window.addEventListener('restore-editor-content', handleRestore);
    return () => window.removeEventListener('restore-editor-content', handleRestore);
  }, [editor]);

  if (isRawMode) {
    return (
      <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-1 bg-white dark:bg-transparent rounded-t-lg justify-end">
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

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) {
      return;
    }
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const Button = ({ onClick, isActive, disabled, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300",
        isActive && "bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg shadow-sm">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 my-auto mx-1" />
      
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 my-auto mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 my-auto mx-1" />

      <Button onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button onClick={addImage} title="Image">
        <ImageIcon className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 my-auto mx-1" />

      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
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
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
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
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none dark:prose-invert max-w-none min-h-[500px]',
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
    setRawContent(content);
  }, [content]);

  return (
    <div className="rounded-lg bg-white dark:bg-transparent flex flex-col">
      <div className="sticky top-0 z-10">
        <MenuBar editor={editor} isRawMode={isRawMode} setIsRawMode={setIsRawMode} />
      </div>
      <div className="flex-1 overflow-y-auto bg-white dark:bg-transparent text-slate-900 dark:text-slate-200 min-h-[500px] relative mt-4">
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
  );
}
