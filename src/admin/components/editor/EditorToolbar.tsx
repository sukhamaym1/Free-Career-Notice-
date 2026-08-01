import React, { useCallback } from 'react';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, 
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, 
  Undo, Redo, Link as LinkIcon, ImageIcon, 
  Palette, Highlighter, Superscript as SupIcon, Subscript as SubIcon,
  RemoveFormatting, Table as TableIcon, Youtube as YoutubeIcon,
  MessageSquareWarning, ChevronDown, SplitSquareVertical, MessageCircle, FileDown, Type
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const ToolbarButton = ({ onClick, isActive, disabled, children, title }: any) => (
  <button
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    disabled={disabled}
    title={title}
    className={cn(
      "p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300",
      isActive && "bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />;

export const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('YouTube Video URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="editor-toolbar border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap items-center gap-1 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md rounded-t-lg shadow-sm sticky top-0 z-40 transition-all duration-300">
      
      <div className="flex items-center gap-1 mr-2">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <Divider />

      <select 
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'p') editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
        }}
        value={
          editor.isActive('heading', { level: 1 }) ? '1' :
          editor.isActive('heading', { level: 2 }) ? '2' :
          editor.isActive('heading', { level: 3 }) ? '3' :
          editor.isActive('heading', { level: 4 }) ? '4' :
          editor.isActive('heading', { level: 5 }) ? '5' :
          editor.isActive('heading', { level: 6 }) ? '6' : 'p'
        }
        className="bg-transparent text-sm border-none focus:ring-0 text-slate-700 dark:text-slate-300 font-medium w-32 cursor-pointer p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrikethrough().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript">
        <SupIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Subscript">
        <SubIcon className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <div className="relative flex items-center" title="Text Color">
        <input
          type="color"
          onChange={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer absolute opacity-0" style={{ zIndex: 10 }}
        />
        <div className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 pointer-events-none flex flex-col items-center">
          <Type className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <div className="w-4 h-1 mt-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes('textStyle').color || 'currentColor' }} />
        </div>
      </div>
      
      <div className="relative flex items-center" title="Background Color">
        <input
          type="color"
          onChange={(e: any) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer absolute opacity-0" style={{ zIndex: 10 }}
        />
        <div className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 pointer-events-none">
          <Highlighter className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </div>
      </div>

      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
        <RemoveFormatting className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Align Justify">
        <AlignJustify className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Checklist">
        <CheckSquare className="w-4 h-4" />
      </ToolbarButton>

      <Divider />
      
      <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Image">
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addYoutube} title="YouTube">
        <YoutubeIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
        <TableIcon className="w-4 h-4" />
      </ToolbarButton>
      
      <Divider />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().insertContent({ type: 'callout', attrs: { type: 'info' }, content: [{ type: 'paragraph' }] }).run()} title="Info Callout">
        <MessageSquareWarning className="w-4 h-4" />
      </ToolbarButton>
      
      <Divider />
      
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={() => {
          const text = window.prompt("Button Text", "Apply Now");
          if (!text) return;
          const href = window.prompt("Button Link", "https://");
          if (!href) return;
          editor.chain().focus().insertContent({ type: "actionButton", attrs: { text, href, type: "primary" } }).run();
        }} title="Insert Primary Button">
          <div className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">Apply</div>
        </ToolbarButton>
        <ToolbarButton onClick={() => {
          const text = window.prompt("Button Text", "Download PDF");
          if (!text) return;
          const href = window.prompt("Button Link", "https://");
          if (!href) return;
          editor.chain().focus().insertContent({ type: "actionButton", attrs: { text, href, type: "secondary" } }).run();
        }} title="Insert Download Button">
          <FileDown className="w-4 h-4" />
        </ToolbarButton>
      </div>

    </div>
  );
};
