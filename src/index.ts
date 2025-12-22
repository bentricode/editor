import '@/assets/scss/main.scss';

import Editor from '@/core/Editor.vue';

import { BentricodeEditorPlugin } from '@/core/plugin';
import EditorViewer from '@/core/EditorViewer.vue';


export {
  Editor,
  BentricodeEditorPlugin,
  EditorViewer
};
export default {
  install: (app: any, options: any = {}) => {
    app.use(BentricodeEditorPlugin, options);
  }
};