import fs from 'fs';

let content = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf-8');

const targetReturnRTE = `  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0f172a] overflow-hidden flex flex-col">
      <MenuBar editor={editor} isRawMode={isRawMode} setIsRawMode={setIsRawMode} />
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 min-h-[250px] relative">`;

const replacementReturnRTE = `  return (
    <div className="rounded-lg bg-white dark:bg-transparent flex flex-col">
      <div className="sticky top-0 z-10">
        <MenuBar editor={editor} isRawMode={isRawMode} setIsRawMode={setIsRawMode} />
      </div>
      <div className="flex-1 overflow-y-auto bg-white dark:bg-transparent text-slate-900 dark:text-slate-200 min-h-[500px] relative mt-4">`;

if (content.includes(targetReturnRTE)) {
  content = content.replace(targetReturnRTE, replacementReturnRTE);
}

const targetMenuBar1 = `    <div className="border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg justify-end">`;
const replacementMenuBar1 = `    <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-1 bg-white dark:bg-transparent rounded-t-lg justify-end">`;
if (content.includes(targetMenuBar1)) {
  content = content.replace(targetMenuBar1, replacementMenuBar1);
}

const targetMenuBar2 = `    <div className="border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">`;
const replacementMenuBar2 = `    <div className="border border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg shadow-sm">`;
if (content.includes(targetMenuBar2)) {
  content = content.replace(targetMenuBar2, replacementMenuBar2);
}

const targetProse = `        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert max-w-none p-4 min-h-[250px]',`;
const replacementProse = `        class: 'prose prose-slate sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none dark:prose-invert max-w-none min-h-[500px]',`;
if (content.includes(targetProse)) {
  content = content.replace(targetProse, replacementProse);
}

fs.writeFileSync('src/components/admin/RichTextEditor.tsx', content);
console.log('Patched RTE visually');
