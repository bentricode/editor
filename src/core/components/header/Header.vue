<template>
  <div class="control-group">
    <div class="button-group">
      
      <template v-for="(item, index) in toolbarItems" :key="index">

        <div v-if="item === 'separator'" class="toolbar-separator"></div>

        <button v-if="item === 'undo'" @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()" v-tippy="$t('header.undo')">
          <component :is="icons.header.undo" />
        </button>

        <button v-if="item === 'redo'" @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()" v-tippy="$t('header.redo')">
          <component :is="icons.header.redo" />
        </button>

        <HeadingDropdown v-if="item === 'text'" :editor="editor" />
        
        <AlignDropdown v-if="item === 'align'" :editor="editor" />
        
        <ListDropdown v-if="item === 'list'" :editor="editor" />
        
        <LinkDropdown v-if="item === 'link'" :editor="editor" />

        <button v-if="item === 'bold'" @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }" v-tippy="$t('header.bold')">
          <component :is="icons.header.bold" />
        </button>

        <button v-if="item === 'italic'" @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }" v-tippy="$t('header.italic')">
          <component :is="icons.header.italic" />
        </button>

        <button v-if="item === 'strikethrough'" @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }" v-tippy="$t('header.strikethrough')">
          <component :is="icons.header.strikethrough" />
        </button>

        <button v-if="item === 'code'" @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }" v-tippy="$t('header.code')">
          <component :is="icons.header.code" />
        </button>

        <button v-if="item === 'codeBlock'" @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }" v-tippy="$t('header.code_block')">
          <component :is="icons.header.codeBlock" />
        </button>

        <button v-if="item === 'blockQuote'" @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }" v-tippy="$t('header.block_quote')">
          <component :is="icons.header.blockQuote" />
        </button>

        <button v-if="item === 'imageUpload'" v-tippy="$t('header.image.name')" @click="addUploadBlock">
          <component :is="icons.header.imageUpload" />
        </button>

      </template>

      <div class="toolbar-separator"></div>
      
      <button @click="toggleFullscreen"
        v-tippy="!is_full_screen ? $t('header.full_screen') : $t('header.exit_full_screen')">
        <component :is="is_full_screen ? icons.header.exitFullScreen : icons.header.fullScreen" />
      </button>
      
    </div>
  </div>
</template>

<script setup>
import HeadingDropdown from '@/core/components/header/HeadingDropdown.vue'
import AlignDropdown from '@/core/components/header/AlignDropdown.vue'
import ListDropdown from '@/core/components/header/ListDropdown.vue'
import LinkDropdown from '@/core/components/header/LinkDropdown.vue'
import { onUnmounted, ref, computed } from 'vue'
import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'

const icons = buildIcons(svgs)

const props = defineProps({
    editor: { type: Object, required: true },
    options: { type: Object, default: () => ({}) },
})

// Lista padrão de ferramentas, caso o usuário não passe nada
const defaultToolbar = [
    'undo', 'redo', 'separator',
    'text', 'bold', 'italic', 'strikethrough', 'separator',
    'list', 'align', 'separator',
    'link', 'imageUpload', 'blockQuote', 'code','codeBlock'
]

// Computed para garantir que sempre tenhamos um array válido
const toolbarItems = computed(() => {
    if (props.options && props.options.toolbar && Array.isArray(props.options.toolbar.items)) {
        return props.options.toolbar.items
    }
    return defaultToolbar
})

const is_full_screen = ref(false)
const addUploadBlock = () => {
    props.editor.chain().focus().addImageUploadBlock().run()
}

const setLink = () => {
    // Pega o link atual se houver
    const previousUrl = props.editor.getAttributes('link').href

    // Abre prompt (ou futuramente um modal customizado)
    const url = window.prompt('URL:', previousUrl)

    // Se cancelou (null) não faz nada
    if (url === null) {
        return
    }

    // Se string vazia, remove o link
    if (url === '') {
        props.editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .run()
        return
    }

    // Seta o link
    props.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
}
function toggleFullscreen() {
    is_full_screen.value = !is_full_screen.value
    if (is_full_screen.value) {
        // Trava o scroll do site
        document.body.classList.add('v-bentri-editor-full-screen-active')
    } else {
        // Destrava o scroll do site
        document.body.classList.remove('v-bentri-editor-full-screen-active')
    }
}
onUnmounted(() => {
    // Garantir que o scroll seja destravado ao desmontar o componente
    document.body.classList.remove('v-bentri-editor-full-screen-active')
})
defineExpose({
    is_full_screen: is_full_screen
})  
</script>

