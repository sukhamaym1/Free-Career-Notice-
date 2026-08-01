import { mergeAttributes, Node } from '@tiptap/core';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Typography } from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Link } from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
      class: { default: null },
      alt: { default: null },
      title: { default: null },
      caption: { default: null }
    };
  },
});

export const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      height: { default: '400' },
      frameborder: { default: '0' },
      allowfullscreen: { default: 'true' },
    };
  },
  parseHTML() {
    return [{ tag: 'iframe' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'iframe-wrapper my-4 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800' }, ['iframe', mergeAttributes(HTMLAttributes)]];
  },
});

export const Details = Node.create({
  name: 'details',
  group: 'block',
  content: 'summary block+',
  parseHTML() { return [{ tag: 'details' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes({ class: 'group border border-slate-200 dark:border-slate-700 rounded-lg my-4 bg-white dark:bg-slate-900 overflow-hidden' }, HTMLAttributes), 0];
  },
});

export const Summary = Node.create({
  name: 'summary',
  group: 'summary',
  content: 'text*',
  marks: '',
  parseHTML() { return [{ tag: 'summary' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['summary', mergeAttributes({ class: 'flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50' }, HTMLAttributes), 0];
  },
});

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  addAttributes() {
    return {
      type: { default: 'info' } // info, warning, success, error, note
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    let classes = 'p-4 my-4 rounded-lg border-l-4 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border-slate-500';
        if (HTMLAttributes.type === 'warning') classes = 'p-4 my-4 rounded-lg border-l-4 text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 border-amber-500';
    if (HTMLAttributes.type === 'success') classes = 'p-4 my-4 rounded-lg border-l-4 text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500';
    if (HTMLAttributes.type === 'error') classes = 'p-4 my-4 rounded-lg border-l-4 text-red-900 dark:text-red-200 bg-red-50 dark:bg-red-900/30 border-red-500';
    if (HTMLAttributes.type === 'info') classes = 'p-4 my-4 rounded-lg border-l-4 text-blue-900 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 border-blue-500';
    return ['div', mergeAttributes({ 'data-type': 'callout', class: classes }, HTMLAttributes), 0];
  },
});

export const ActionButton = Node.create({
  name: 'actionButton',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      href: { default: '#' },
      text: { default: 'Button' },
      type: { default: 'primary' } // primary, secondary, telegram, whatsapp
    };
  },
  parseHTML() {
    return [{ tag: 'a[data-type="action-button"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    let classes = 'inline-block px-6 py-3 rounded-lg font-bold text-center transition-colors shadow-sm my-4 no-underline ';
    if (HTMLAttributes.type === 'telegram') classes += 'bg-[#0088cc] text-white hover:bg-[#0077b3]';
    else if (HTMLAttributes.type === 'whatsapp') classes += 'bg-[#25D366] text-white hover:bg-[#20bd5a]';
    else if (HTMLAttributes.type === 'secondary') classes += 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600';
    else classes += 'bg-blue-600 text-white hover:bg-blue-700';
    return ['a', mergeAttributes({ 'data-type': 'action-button', class: classes, target: '_blank', rel: 'noopener noreferrer' }, HTMLAttributes), HTMLAttributes.text];
  },
  addNodeView() {
    return ({ node, getPos }) => {
      const dom = document.createElement("a");
      let classes = "inline-block px-6 py-3 rounded-lg font-bold text-center transition-colors shadow-sm my-4 no-underline ";
      if (node.attrs.type === "telegram") classes += "bg-[#0088cc] text-white hover:bg-[#0077b3]";
      else if (node.attrs.type === "whatsapp") classes += "bg-[#25D366] text-white hover:bg-[#20bd5a]";
      else if (node.attrs.type === "secondary") classes += "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600";
      else classes += "bg-blue-600 text-white hover:bg-blue-700";
      dom.className = classes;
      dom.href = node.attrs.href || "#";
      dom.innerText = node.attrs.text || "Button";
      dom.setAttribute("data-type", "action-button");
      dom.addEventListener("click", (e) => {
        e.preventDefault();
      });
      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'actionButton') return false;
          let classes = "inline-block px-6 py-3 rounded-lg font-bold text-center transition-colors shadow-sm my-4 no-underline ";
          if (updatedNode.attrs.type === "telegram") classes += "bg-[#0088cc] text-white hover:bg-[#0077b3]";
          else if (updatedNode.attrs.type === "whatsapp") classes += "bg-[#25D366] text-white hover:bg-[#20bd5a]";
          else if (updatedNode.attrs.type === "secondary") classes += "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600";
          else classes += "bg-blue-600 text-white hover:bg-blue-700";
          dom.className = classes;
          dom.href = updatedNode.attrs.href || "#";
          dom.innerText = updatedNode.attrs.text || "Button";
          return true;
        }
      };
    };
  }
});

export const Timeline = Node.create({
  name: 'timeline',
  group: 'block',
  content: 'timelineItem+',
  parseHTML() { return [{ tag: 'div[data-type="timeline"]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'timeline', class: 'border-l-2 border-blue-500 ml-4 pl-6 py-2 my-6 space-y-6' }, HTMLAttributes), 0];
  },
});

export const TimelineItem = Node.create({
  name: 'timelineItem',
  group: 'timelineItem',
  content: 'block+',
  parseHTML() { return [{ tag: 'div[data-type="timeline-item"]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'timeline-item', class: 'relative' }, HTMLAttributes), 
      ['div', { class: 'absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900' }],
      ['div', { class: 'timeline-content' }, 0]
    ];
  },
});

export {
  Table, TableRow, TableCell, TableHeader,
  TaskList, TaskItem, Youtube,
  Underline, Highlight, TextAlign,
  Superscript, Subscript, CharacterCount,
  Dropcursor, Typography, Placeholder, Link, Color, TextStyle
};
