<template>
  <div
    :data-editor-theme-base="props.palette"
    ref="editor_ref" 
    class="tiptap-viewer read-only"
    :class="{ 
      'dark-mode': isDark,
    }"
    v-if="editor"
  >
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { ListItem } from '@tiptap/extension-list'
import TextAlign from '@tiptap/extension-text-align'

import { ResizableImage, ImageUploadBlock } from '@/assets/js/extensions/CustomImage.js'
import { CodeBlockCustom } from '@/assets/js/extensions/CustomCodeBlock.js'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  content: {
    type: [String, Object],
    default: '',
  },
  options:{
    type: Object,
    default: () => ({}),
  },
  theme:{
    type: String,
    default: 'auto',
  },
  palette:{
    type: String,
    default: 'slate', 
  }
})

const isSystemDark = ref(false)

const updateSystemTheme = () => {
  if (typeof document !== 'undefined') {
    isSystemDark.value =
      document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
      document.body.getAttribute('data-bs-theme') === 'dark'
  }
}

let themeObserver = null

onMounted(() => {
  updateSystemTheme()
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    themeObserver = new MutationObserver(updateSystemTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] })
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-bs-theme'] })
  }
})

onUnmounted(() => {
  if (themeObserver) {
    themeObserver.disconnect()
  }
})

const isDark = computed(() => {
  if (props.theme === 'dark') return true
  if (props.theme === 'light') return false
  return isSystemDark.value
})

const editor = useEditor({
  editable: false, 
  content: props.content,
  extensions: [
    StarterKit.configure({
      codeBlock: false, 
      link: {
        openOnClick: true,
        ...props.options.link
      } || {},
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    Highlight.configure({ multicolor: true }),
    Table.configure({
      resizable: false,
    }),
    TableRow,
    TableHeader,
    TableCell,
    TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),

    CodeBlockCustom,
    ResizableImage,
    ImageUploadBlock, 
  ],
})

watch(() => props.content, (newValue) => {
  if (!editor.value) return

  const isSame = editor.value.getHTML() === newValue
  if (!isSame) {
    editor.value.commands.setContent(newValue, false) 
  }
})

defineExpose({
  editor,
})
</script>

<style lang="scss">
.tiptap-viewer.read-only {
  .ProseMirror {
    outline: none;
    border: none;
    padding: 0;
  }

  .resize-handle {
    display: none !important;
  }

  .bentri-actions {
    display: none !important;
  }
  
  .image-resizer.is-selected .image-container img {
    outline: none !important;
  }
}
</style>