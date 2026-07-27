const fs = require('fs');

let content = fs.readFileSync('src/admin/components/RichTextEditor.tsx', 'utf8');

// Add Focus and Extension import
content = content.replace("import StarterKit from '@tiptap/starter-kit';", "import StarterKit from '@tiptap/starter-kit';\nimport Focus from '@tiptap/extension-focus';\nimport { Extension } from '@tiptap/core';");

// Add Keyboard Shortcuts extension
content = content.replace("export default function RichTextEditor", `const CustomShortcuts = Extension.create({
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

export default function RichTextEditor`);

// Update props
content = content.replace("interface RichTextEditorProps {", "interface RichTextEditorProps {\n  isFocusMode?: boolean;");
content = content.replace("export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {", "export default function RichTextEditor({ content, onChange, placeholder, isFocusMode }: RichTextEditorProps) {");

// Add Focus extension based on isFocusMode state - wait, tiptap extensions array should be stable. We can configure Focus with a dynamic class or just always include it and toggle a container class.
content = content.replace("StarterKit.configure({", `CustomShortcuts,
      Focus.configure({
        className: 'has-focus',
        mode: 'deepest',
      }),
      StarterKit.configure({`);

// Add focus mode class to container
content = content.replace("class: 'prose prose-slate sm:prose lg:prose-lg xl:prose-xl focus:outline-none dark:prose-invert max-w-none min-h-[500px] p-6',",
  "class: `prose prose-slate sm:prose lg:prose-lg xl:prose-xl focus:outline-none dark:prose-invert max-w-none min-h-[500px] p-6 editor-content ${isFocusMode ? 'focus-mode-active' : ''}`,");

// Make the main wrapper relative, remove shadow maybe? "Keep proper shadow." "Maintain dark theme."
// "Sticky Toolbar" "Toolbar stays fixed at the top while scrolling the article: Toolbar stays fixed at top. No jumping. Smooth transition."
// We can make Toolbar sticky in EditorToolbar.tsx, but EditorToolbar is rendered inside RichTextEditor.
// RichTextEditor wrapper:
content = content.replace(
  '<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">',
  '<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all relative overflow-visible">'
);

fs.writeFileSync('src/admin/components/RichTextEditor.tsx', content);

