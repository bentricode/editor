<template>
  <div 
  :data-editor-theme-base="props.palette"
  @dragover="handleDragOver" @drop="handleDrop" @dragleave="handleDragLeave"
  ref="editor_ref" v-if="editor" class="v-bentri-editor " :class="{ 'v-bentri-editor-full-screen': header_ref?.is_full_screen,
    'dark-mode': props.theme === 'dark',
   }">
    <Header ref="header_ref" :editor="editor" />

    <div class="editor-layout relative" >

      <NotionSidebar :editor="editor" 
      @drag-end="dragState.show = false"
      />

      <div class="drop-indicator" v-if="dragState.show" :style="{
        top: dragState.top + 'px',
        left: dragState.left + 'px',
        width: dragState.width + 'px'
      }"></div>

      <div class="v-bentri-editor-tiptap">
        <editor-content :editor="editor" spellcheck="false" />
      </div>

    </div>

    <FloatMenu :editor="editor"/>
    <div v-if="showImageModal" class="modal-overlay" @click.self="showImageModal = false">
      <div class="modal-content">
        <h3>Inserir Imagem</h3>

        <ImageUploadDrag @insert-image="handleImageInsert" />

        <button class="btn-close" @click="showImageModal = false">Cancelar</button>
      </div>
    </div>
  </div>

</template>

<script setup>

import { ListItem } from '@tiptap/extension-list'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'

import { NodeSelection } from '@tiptap/pm/state'

import NotionSidebar from './components/NotionSidebar.vue'

import { reactive, ref, watch, provide } from 'vue'

import { ResizableImage, ImageUploadBlock } from '@/assets/js/extensions/CustomImage.js'
import { CodeBlockCustom } from '@/assets/js/extensions/CustomCodeBlock.js'
import ImageUploadDrag from './components/image/ImageUploadComponent.vue'
import Header from './components/header/Header.vue'
import TextAlign from '@tiptap/extension-text-align'
import Commands from '@/assets/js/extensions/Commands.js'
import suggestion from '@/assets/js/extensions/suggestion.js'
import FloatMenu from './components/FloatMenu.vue'

const editor_ref = ref(null)
provide('editor_ref', editor_ref)
const header_ref = ref(null)

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  theme:{
    type: String,
    default: 'light', // light ou dark
  },
  palette:{
    type: String,
    default: 'slate', 
  }
})
const emit = defineEmits(['update:modelValue'])
const showImageModal = ref(false)
// --- ESTADO REATIVO DO DRAG ---
const dragState = reactive({
  show: false,
  top: 0,
  left: 0,
  width: 0,
  targetPos: -1
})


// --- FUNÇÃO: MOVER O NÓ ---
const moveNode = (view, from, to) => {
  const { state, dispatch } = view
  const { doc, tr } = state

  const $from = doc.resolve(from)
  const nodeToMove = $from.nodeAfter

  if (!nodeToMove) return

  // Evita mover para dentro de si mesmo ou para a mesma posição
  const nodeEnd = from + nodeToMove.nodeSize
  if (to >= from && to < nodeEnd) return

  // 1. INSERE CÓPIA
  tr.insert(to, nodeToMove)

  // 2. CALCULA ONDE DELETAR O ORIGINAL
  // Se inseriu antes, o original foi empurrado para frente
  let deletePos = from
  if (to < from) {
    deletePos += nodeToMove.nodeSize
  }

  // 3. DELETA ORIGINAL
  tr.delete(deletePos, deletePos + nodeToMove.nodeSize)

  // 4. RESTAURA SELEÇÃO NO NOVO BLOCO
  const newSelectionPos = to < from ? to : to - nodeToMove.nodeSize
  const newSelection = NodeSelection.create(tr.doc, newSelectionPos)
  tr.setSelection(newSelection)

  dispatch(tr)
}

const editor = useEditor({
  extensions: [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      dropcursor: false, // Desabilita o dropcursor nativo

    }),
    Commands.configure({
      suggestion,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image'], 
    }),
    CodeBlockCustom,
    ResizableImage,
    ImageUploadBlock,


    Placeholder.configure({
      placeholder: 'Type \'/\' for a menu',
      //Isso faz o placeholder funcionar em parágrafos internos, 
      // não só quando o documento inteiro está vazio.
      includeChildren: true,
    }),


  ],
  editorProps: {
    // Impede o Tiptap de desenhar o cursor nativo de drag
    handleDragOver: (view, event) => {
      event.preventDefault()
      return true // Retornar true diz pro Tiptap: "Não faça nada"
    },

    // Impede o Tiptap de tentar mover o texto quando solta
    handleDrop: (view, event, slice, moved) => {
      event.preventDefault()
      return true // Retorna true para cancelar o drop nativo do Tiptap
    }
  },
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    // Pega o HTML gerado
    const html = editor.getHTML()

    // Emite para o pai
    emit('update:modelValue', html)
  },


})

const handleDragOver = (event) => {
  event.preventDefault() 

  if (!event.dataTransfer.types.includes('tiptap/from-pos')) return

  const view = editor.value.view
  const editorRect = view.dom.getBoundingClientRect()

  const safeX = Math.max(event.clientX, editorRect.left + 80)
  
  const coords = { left: safeX, top: event.clientY }
  const posObj = view.posAtCoords(coords)

  if (!posObj) return

  const $pos = view.state.doc.resolve(posObj.pos)

  let domNode = view.domAtPos(posObj.pos).node
  if (domNode.nodeType === 3) domNode = domNode.parentElement
  const blockElement = domNode.closest('.tiptap > *')

  if (blockElement) {
    const rect = blockElement.getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    const isTop = event.clientY < midpoint
    dragState.show = true
    const editorLayout = document.querySelector('.editor-layout')
    const layoutRect = editorLayout.getBoundingClientRect()
    dragState.left = rect.left - layoutRect.left
    dragState.width = rect.width
    
    // Verificamos se depth >= 1 para evitar erros em documentos vazios
    if ($pos.depth >= 1) {
        if (isTop) {
          dragState.top = rect.top - editorRect.top - 2
          dragState.targetPos = $pos.before(1) // Posição exata ANTES do bloco
        } else {
          dragState.top = rect.bottom - editorRect.top - 2
          dragState.targetPos = $pos.after(1)  // Posição exata DEPOIS do bloco
        }
    }
  }
}
// --- HANDLE DRAG LEAVE (LIMPA QUANDO SAI) ---
const handleDragLeave = (event) => {
  // O evento dragleave dispara quando entra em filhos (ex: parágrafo).
  const editorLayout = document.querySelector('.editor-layout')
  
  // Se o elemento para onde o mouse foi (relatedTarget) NÃO está dentro do editor...
  if (editorLayout && !editorLayout.contains(event.relatedTarget)) {
    dragState.show = false
    dragState.targetPos = -1
  }
}
// --- HANDLE DROP (GARANTE LIMPEZA) ---
const handleDrop = (event) => {
  // Limpeza imediata visual
  dragState.show = false
  
  const fromPosStr = event.dataTransfer.getData('tiptap/from-pos')
  
  if (fromPosStr && dragState.targetPos !== -1) {
    const originPos = parseInt(fromPosStr, 10)
    // Pequeno delay para garantir que a UI não trave
    moveNode(editor.value.view, originPos, dragState.targetPos)
  }
  
  dragState.targetPos = -1
}
watch(() => props.modelValue, (newValue) => {
  // Só atualiza se o conteúdo for diferente para evitar loop infinito
  const isSame = editor.value.getHTML() === newValue
  if (!isSame) {
    editor.value.commands.setContent(newValue, false)
  }
})
/**
 * Retorna uma lista de todas as URLs blob presentes no editor
 * e seus metadados, para o usuário fazer upload.
 */
const getPendingBlobs = () => {
  const blobs = []
  if (!editor.value) return blobs

  editor.value.state.doc.descendants((node) => {
    if (node.type.name === 'resizableImage' || node.type.name === 'image') {
      const src = node.attrs.src
      if (src && src.startsWith('blob:')) {
        blobs.push({
          src: src,
          alt: node.attrs.alt,
          pos: null // Opcional: guardar posição se necessário
        })
      }
    }
  })
  
  // Retorna apenas URLs únicas para evitar uploads duplicados
  return [...new Set(blobs.map(b => b.src))]
}

/**
 * Recebe um objeto de mapeamento { "blob:url...": "https://servidor.com/img.jpg" }
 * e troca todas as ocorrências no documento.
 */
const updateImageUrls = (replacements) => {
  if (!editor.value) return

  const { state, view } = editor.value
  const tr = state.tr
  let hasChanges = false

  state.doc.descendants((node, pos) => {
    if (node.type.name === 'resizableImage' || node.type.name === 'image') {
      const currentSrc = node.attrs.src
      const newUrl = replacements[currentSrc]

      if (newUrl) {
        // Atualiza o atributo 'src' do nó específico
        tr.setNodeMarkup(pos, null, {
          ...node.attrs,
          src: newUrl
        })
        hasChanges = true
      }
    }
  })

  if (hasChanges) {
    view.dispatch(tr)
    // Revoga as URLs blob para liberar memória do navegador
    Object.keys(replacements).forEach(url => URL.revokeObjectURL(url))
  }
}
const getHTML = () => {
  return editor.value ? editor.value.getHTML() : ''
}

defineExpose({
  getPendingBlobs,
  updateImageUrls,
  getHTML
})
</script>
