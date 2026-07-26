import fs from 'fs';

let content = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf-8');

const targetImport = `import React from 'react';`;
const replacementImport = `import React, { useEffect } from 'react';`;

const targetEditorUse = `  const editor = useEditor({`;
const replacementEditorUse = `  const editor = useEditor({`;

const targetReturn = `  return (`;
const replacementReturn = `  useEffect(() => {
    const handleRestore = (e: any) => {
      if (editor) {
        editor.commands.setContent(e.detail);
      }
    };
    window.addEventListener('restore-editor-content', handleRestore);
    return () => window.removeEventListener('restore-editor-content', handleRestore);
  }, [editor]);

  return (`;

if (content.includes(targetImport)) {
  content = content.replace(targetImport, replacementImport);
}
if (content.includes(targetReturn)) {
  content = content.replace(targetReturn, replacementReturn);
  fs.writeFileSync('src/components/admin/RichTextEditor.tsx', content);
  console.log('Patched RichTextEditor successfully.');
} else {
  console.log('targetReturn not found');
}
