import { Editor, Extension } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
const Ext = Extension.create({
  name: 'test',
  addProseMirrorPlugins() {
    console.log(this.name, !!this.editor);
    return [];
  }
});
const editor = new Editor({ extensions: [StarterKit, Ext] });
