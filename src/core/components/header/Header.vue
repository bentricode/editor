<template>
  <div class="control-group">
    <div class="button-group">
      
      <template v-for="(item, index) in toolbarItems" :key="index">

        <div v-if="item === 'separator'" class="toolbar-separator"></div>

        <button v-if="item === 'undo'" @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()" v-tippy="'Desfazer'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" />
          </svg>
        </button>

        <button v-if="item === 'redo'" @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()" v-tippy="'Refazer'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 14l4 -4l-4 -4" /><path d="M19 10h-11a4 4 0 1 0 0 8h1" />
          </svg>
        </button>

        <HeadingDropdown v-if="item === 'text'" :editor="editor" />
        
        <AlignDropdown v-if="item === 'align'" :editor="editor" />
        
        <ListDropdown v-if="item === 'list'" :editor="editor" />
        
        <LinkDropdown v-if="item === 'link'" :editor="editor" />

        <button v-if="item === 'bold'" @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }" v-tippy="'Negrito'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path><path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
          </svg>
        </button>

        <button v-if="item === 'italic'" @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }" v-tippy="'Itálico'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 5l6 0"></path><path d="M7 19l6 0"></path><path d="M14 5l-4 14"></path>
          </svg>
        </button>

        <button v-if="item === 'strikethrough'" @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }" v-tippy="'Tachado'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
          </svg>
        </button>

        <button v-if="item === 'code'" @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }" v-tippy="'Código Inline'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" />
          </svg>
        </button>

        <button v-if="item === 'blockCode' || item === 'codeBlock'" @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }" v-tippy="'Bloco de Código'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14.5 4h2.5a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-5" /><path d="M6 5l-2 2l2 2" /><path d="M10 9l2 -2l-2 -2" />
          </svg>
        </button>

        <button v-if="item === 'blockQuote'" @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }" v-tippy="'Citação'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 15h15" /><path d="M21 19h-15" /><path d="M15 11h6" /><path d="M21 7h-6" /><path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /><path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
          </svg>
        </button>

        <button v-if="item === 'imageUpload'" v-tippy="$t('header.image_upload')" @click="addUploadBlock">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>

      </template>

      <div class="toolbar-separator"></div>
      
      <button @click="toggleFullscreen"
        v-tippy="!is_full_screen ? $t('header.full_screen') : $t('header.exit_full_screen')">
        <svg v-if="!is_full_screen" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 4l4 0l0 4" /><path d="M14 10l6 -6" /><path d="M8 20l-4 0l0 -4" /><path d="M4 20l6 -6" /><path d="M16 20l4 0l0 -4" /><path d="M14 14l6 6" /><path d="M8 4l-4 0l0 4" /><path d="M4 4l6 6" />
        </svg>
        <svg v-if="is_full_screen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 9l4 0l0 -4" /><path d="M3 3l6 6" /><path d="M5 15l4 0l0 4" /><path d="M3 21l6 -6" /><path d="M19 9l-4 0l0 -4" /><path d="M15 9l6 -6" /><path d="M19 15l-4 0l0 4" /><path d="M15 15l6 6" />
        </svg>
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

