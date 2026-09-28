import '@/assets/scss/main.scss';

import Editor from '@/core/Editor.vue';

import { BentricodeEditorPlugin } from '@/core/plugin';
import EditorViewer from '@/core/EditorViewer.vue';


import type { App } from 'vue';
import type { EditorOptions, BentricodeEditorPluginOptions } from '@/types';

export const defaultEditorOptions: EditorOptions = {
  toolbar: {
    items: [
      'undo', 'redo', 'separator',
      'text', 'bold', 'italic', 'strikethrough', 'clearFormatting', 'separator',
      'color', 'separator',
      'list', 'align', 'table', 'separator',
      'link', 'imageUpload', 'blockQuote', 'code', 'codeBlock'
    ]
  },
  link: {
    protocols: ['http', 'https', 'ssh'],
  }
};

export * from '@/types';

export {
  Editor,
  BentricodeEditorPlugin,
  EditorViewer
};

export default {
  install: (app: App, options?: BentricodeEditorPluginOptions) => {
    app.use(BentricodeEditorPlugin, options);
  }
};