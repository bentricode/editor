<template>

  <bubble-menu class="container-tip-float" :editor="editor"  :should-show="shouldShowTextMenu">
    <div class="bubble-menu text-menu">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <component :is="icons.header.bold" />
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <component :is="icons.header.italic" />
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <component :is="icons.header.strikethrough" />
      </button>
    </div>
  </bubble-menu>

  <bubble-menu class="container-tip-float" :editor="editor" 
    :should-show="shouldShowImageMenu">
    <div class="bubble-menu image-menu">
      <button @click="replaceImageWithUpload" class="btn-replace" v-tippy="t('header.image.trade')">
        <component :is="icons.replace" />
      </button>

      <div class="divider"></div>

      <button @click="deleteSelectedImage" class="btn-delete" v-tippy="t('header.image.remove')">
        <component :is="icons.trash" />
      </button>
    </div>
  </bubble-menu>
</template>
<script setup>
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  editor: { type: Object, required: true }
})


const { t } = useI18n()
const icons = buildIcons(svgs)
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