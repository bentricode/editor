<template>
  <div class="tiptap-viewer read-only" v-if="editor">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { ListItem } from '@tiptap/extension-list'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { ResizableImage, ImageUploadBlock } from '@/assets/js/extensions/CustomImage.js'
import { CodeBlockCustom } from '@/assets/js/extensions/CustomCodeBlock.js'
import { watch } from 'vue'
// Recebe o conteúdo (string HTML ou JSON)
const props = defineProps({
  content: {
    type: [String, Object],
    default: '',
  }
})

const editor = useEditor({
  // Desabilita a edição
  editable: false, 
  
  content: props.content,
  
  extensions: [
    StarterKit.configure({
      codeBlock: false, 
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
    Link.configure({ openOnClick: true }), // Links funcionam no modo leitura
    
    CodeBlockCustom,
    ResizableImage,
    ImageUploadBlock, 
  ],
})

watch(() => props.content, (newValue) => {
  if (!editor.value) return

  // Verifica se o conteúdo é realmente diferente para evitar loops ou processamento desnecessário
  const isSame = editor.value.getHTML() === newValue
  
  if (!isSame) {
    // Força o editor a trocar o conteúdo
    editor.value.commands.setContent(newValue, false) 
  }
})
</script>

<style lang="scss">

.tiptap-viewer.read-only {
  /* Remove as bordas de seleção ou foco */
  .ProseMirror {
    outline: none;
    border: none;
    padding: 0;
  }

  /* Esconde as bolinhas de redimensionar imagem no modo leitura */
  .resize-handle {
    display: none !important;
  }

  /* Esconde menus de ação do bloco de código se houver */
  .bentri-actions {
    display: none !important;
  }
  
  /* Remove a borda roxa de seleção da imagem */
  .image-resizer.is-selected .image-container img {
    outline: none !important;
  }
}
</style>