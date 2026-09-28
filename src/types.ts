import type { App } from 'vue';

export type ToolbarItem =
  | 'undo'
  | 'redo'
  | 'separator'
  | 'text'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'clearFormatting'
  | 'color'
  | 'list'
  | 'align'
  | 'table'
  | 'link'
  | 'imageUpload'
  | 'blockQuote'
  | 'code'
  | 'codeBlock';

export type ThemeMode = 'auto' | 'light' | 'dark';

export type PaletteType = 'slate' | 'default' | 'zinc' | 'neutral' | 'stone';

export interface EditorToolbarOptions {
  items?: (ToolbarItem | string)[];
}

export interface EditorLinkOptions {
  protocols?: string[];
}

export interface EditorOptions {
  toolbar?: EditorToolbarOptions;
  link?: EditorLinkOptions;
  [key: string]: unknown;
}

export interface EditorProps {
  modelValue?: string;
  options?: EditorOptions;
  locale?: string;
  theme?: ThemeMode;
  palette?: PaletteType;
}

export type EditorEmits = {
  (e: 'update:modelValue', value: string): void;
};

export interface EditorViewerProps {
  content?: string | Record<string, unknown>;
  options?: EditorOptions;
  theme?: ThemeMode;
  palette?: PaletteType;
}

export interface BentricodeEditorPluginOptions {
  [key: string]: unknown;
}

export interface BentricodeEditorPlugin {
  install: (app: App, options?: BentricodeEditorPluginOptions) => void;
}
