import fs from 'fs';

let content = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf-8');

const targetMenuBar = `const MenuBar = ({ editor, isRawMode, setIsRawMode }: { editor: any, isRawMode: boolean, setIsRawMode: (v: boolean) => void }) => {
  if (isRawMode) {`;

const replacementMenuBar = `const MenuBar = ({ editor, isRawMode, setIsRawMode }: { editor: any, isRawMode: boolean, setIsRawMode: (v: boolean) => void }) => {
  useEffect(() => {
    const handleRestore = (e: any) => {
      if (editor) {
        editor.commands.setContent(e.detail);
      }
    };
    window.addEventListener('restore-editor-content', handleRestore);
    return () => window.removeEventListener('restore-editor-content', handleRestore);
  }, [editor]);

  if (isRawMode) {`;

const targetUseEffectOld = `  useEffect(() => {
    const handleRestore = (e: any) => {
      if (editor) {
        editor.commands.setContent(e.detail);
      }
    };
    window.addEventListener('restore-editor-content', handleRestore);
    return () => window.removeEventListener('restore-editor-content', handleRestore);
  }, [editor]);

  return (`;

const replacementUseEffectOld = `  return (`;

if (content.includes(targetMenuBar) && content.includes(targetUseEffectOld)) {
  content = content.replace(targetMenuBar, replacementMenuBar);
  content = content.replace(targetUseEffectOld, replacementUseEffectOld);
  fs.writeFileSync('src/components/admin/RichTextEditor.tsx', content);
  console.log("Patched MenuBar hooks!");
} else {
  console.log("Could not find targets");
}
