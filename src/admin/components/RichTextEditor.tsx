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
  Palette, FileCode2, ChevronDown, PlusCircle, Video, Layout, LayoutTemplate
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
      
      
      <div className="relative group">
        <button
          type="button"
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-1 text-sm font-medium"
          title="Insert Custom Blocks"
        >
          <PlusCircle className="w-4 h-4" /> Insert <ChevronDown className="w-3 h-3" />
        </button>
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Components</div>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<div class="p-4 my-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-300"><strong>Notice:</strong> Your alert message here.</div><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Alert Box
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm my-2 no-underline">Download File</a><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Download Button
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4"><div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">Column 1 Content</div><div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">Column 2 Content</div></div><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            2 Columns
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<hr class="my-8 border-t border-slate-200 dark:border-slate-800" /><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Divider
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<div class="border-l-2 border-blue-500 ml-4 pl-4 py-2 my-4 space-y-4"><div class="relative"><div class="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900"></div><h4 class="font-bold text-slate-900 dark:text-white mt-0 mb-1">Timeline Step 1</h4><p class="text-sm text-slate-600 dark:text-slate-400 m-0">Details here.</p></div></div><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Timeline
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<details class="group border border-slate-200 dark:border-slate-700 rounded-lg my-4 bg-white dark:bg-slate-900"><summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-900 dark:text-white"><span>Accordion / FAQ Title</span><span class="transition group-open:rotate-180"><svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span></summary><div class="text-slate-600 dark:text-slate-400 mt-2 px-4 pb-4"><p>Your content here.</p></div></details><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Accordion / FAQ
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<blockquote class="border-l-4 border-blue-500 italic my-6 pl-4 text-slate-700 dark:text-slate-300 text-lg py-2"><p>"This is a prominent quote or callout block."</p></blockquote><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Quote Block
          </button>

          <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 border-t border-slate-100 dark:border-slate-700 pt-2">Media & Embeds</div>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<div class="aspect-video w-full my-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            YouTube Embed
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<div class="w-full my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-[600px]"><iframe src="https://drive.google.com/file/d/your-file-id/preview" width="100%" height="100%" allow="autoplay"></iframe></div><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Google Drive/PDF Embed
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-slate-200 dark:border-slate-700"><thead><tr class="bg-slate-50 dark:bg-slate-800"><th class="p-3 border border-slate-200 dark:border-slate-700">Header 1</th><th class="p-3 border border-slate-200 dark:border-slate-700">Header 2</th></tr></thead><tbody><tr><td class="p-3 border border-slate-200 dark:border-slate-700">Data 1</td><td class="p-3 border border-slate-200 dark:border-slate-700">Data 2</td></tr></tbody></table></div><p></p>').run()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Table
          </button>
        </div>
      </div>
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
