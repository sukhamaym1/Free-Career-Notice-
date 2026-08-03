import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';

const editor = new Editor({
  extensions: [
    StarterKit,
    Table, TableRow, TableCell, TableHeader,
    Markdown.configure({ transformPastedText: true })
  ]
});

const md = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;

const parsed = editor.storage.markdown.parser.parse(md);
console.log(parsed);
