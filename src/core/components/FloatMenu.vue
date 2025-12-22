<template>

  <bubble-menu class="container-tip-float" :editor="editor"  :should-show="shouldShowTextMenu">
    <div class="bubble-menu text-menu">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path>
          <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
        </svg>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5l6 0"></path>
          <path d="M7 19l6 0"></path>
          <path d="M14 5l-4 14"></path>
        </svg>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
        </svg>
      </button>
    </div>
  </bubble-menu>

  <bubble-menu class="container-tip-float" :editor="editor" 
    :should-show="shouldShowImageMenu">
    <div class="bubble-menu image-menu">
      <button @click="replaceImageWithUpload" class="btn-replace" title="Trocar Imagem">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
      </button>

      <div class="divider"></div>

      <button @click="deleteSelectedImage" class="btn-delete" title="Remover Imagem">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 7l16 0" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </button>
    </div>
  </bubble-menu>
</template>
<script setup>
import { BubbleMenu } from '@tiptap/vue-3/menus'

const props = defineProps({
  editor: { type: Object, required: true }
})
const shouldShowTextMenu = ({ editor, state }) => {
  if (state.selection.empty) return false // Não mostra se não tem seleção
  if (editor.isActive('image')) return false // Não mostra se for imagem
  if (editor.isActive('codeBlock')) return false // Não mostra em code block
  if (editor.isActive('imageUpload')) return false // Não mostra em upload block
  return true
}
const shouldShowImageMenu = ({ editor }) => {
  return editor.isActive('image')
}
// Trocar Imagem: Substitui a imagem selecionada pelo bloco de upload vazio
const replaceImageWithUpload = () => {
  if (!props.editor) return
  props.editor.chain().focus().addImageUploadBlock().run()
}

// Remover Imagem: Deleta a seleção atual
const deleteSelectedImage = () => {
  if (!props.editor) return
  props.editor.chain().focus().deleteSelection().run()
}
</script>
<style lang="scss" >  

</style>