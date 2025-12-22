<template>
  <div class="notion-sidebar" :style="menuStyle" :class="{ 'is-visible': showMenu }" draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    >
    
    <div class="sidebar-actions">
      <button @click="addNode" class="sidebar-btn" title="Adicionar bloco abaixo">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
      </button>

      <div 
        class="sidebar-btn drag-handle" 
        @mousedown="handleDragMousedown" 
        @click.stop="toggleBlockMenu"
        title="Arrastar ou Clique para Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
      </div>

      <div v-if="showBlockMenu" class="block-menu-dropdown" v-click-outside="closeBlockMenu">
        
        <div class="menu-search">
           <input 
             ref="searchInput"
             v-model="searchQuery" 
             type="text" 
             placeholder="Pesquisar ações..."
             @click.stop
           />
        </div>

        <div class="menu-label">Ações</div>

        <div class="menu-scroller">
          <button 
            v-for="(action, index) in filteredActions" 
            :key="index"
            @click="action.handler"
            class="menu-item"
            :class="{ 'delete': action.id === 'delete' }"
          >
            <component :is="action.icon" class="icon-svg" />
            
            <span>{{ action.label }}</span>
            <span v-if="action.shortcut" class="shortcut">{{ action.shortcut }}</span>
          </button>

          <div v-if="filteredActions.length === 0" class="no-results">
            Nenhuma ação encontrada
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, h, watch } from 'vue'
import { NodeSelection } from '@tiptap/pm/state'

// --- ÍCONES  ---
const IconCopy = () => h('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [
    h('path', { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h('path', { d: "M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" }),
    h('path', { d: "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" })
])

const IconDuplicate = () => h('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [
    h('path', { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h('path', { d: "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" }),
    h('path', { d: "M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" }),
    h('path', { d: "M11 14h6" }),
    h('path', { d: "M14 11v6" })
])

const IconTrash = () => h('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [
    h('path', { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h('path', { d: "M4 7l16 0" }),
    h('path', { d: "M10 11l0 6" }),
    h('path', { d: "M14 11l0 6" }),
    h('path', { d: "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" }),
    h('path', { d: "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" })
])

const IconCut = () => h('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [
    h('path', { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    h('path', { d: "M6 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" }),
    h('path', { d: "M6 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" }),
    h('path', { d: "M8.6 8.6l10.4 10.4" }),
    h('path', { d: "M8.6 15.4l10.4 -10.4" })
])
// Diretiva v-click-outside
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

const props = defineProps({
  editor: { type: Object, required: true }
})

// Estados
const showMenu = ref(false)
const menuTop = ref(0)
const activeNodePos = ref(null)
const showBlockMenu = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const menuStyle = computed(() => ({ top: `${menuTop.value}px` }))

// --- DEFINIÇÃO DAS AÇÕES DISPONÍVEIS ---
const allActions = [
  { id: 'duplicate', label: 'Duplicar', icon: IconDuplicate, handler: () => duplicateNode(), shortcut: '' },
  { id: 'copy', label: 'Copiar Texto', icon: IconCopy, handler: () => copyNodeText(), shortcut: '' },
  { id: 'cut', label: 'Recortar', icon: IconCut, handler: () => cutNode(), shortcut: 'Ctrl+X' },
  { id: 'delete', label: 'Excluir', icon: IconTrash, handler: () => deleteNode(), shortcut: '' },
]

// --- FILTRO DE PESQUISA ---
const filteredActions = computed(() => {
  if (!searchQuery.value) return allActions
  const term = searchQuery.value.toLowerCase()
  return allActions.filter(action => action.label.toLowerCase().includes(term))
})

// --- LÓGICA DE FOCO AUTOMÁTICO ---
watch(showBlockMenu, (val) => {
  if (val) {
    searchQuery.value = '' // Limpa busca ao abrir
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

// --- MOUSE MOVE & POSICIONAMENTO ---
const handleWindowMouseMove = (event) => {
  if (showBlockMenu.value) return 
  if (!props.editor || !props.editor.view) return

  if (event.target.closest('.notion-sidebar')) {
    return
  }

  const view = props.editor.view
  const editorRect = view.dom.getBoundingClientRect()
  const gutterWidth = 80
  
  // Verifica se está na zona de ativação
  const isInsideY = event.clientY >= editorRect.top && event.clientY <= editorRect.bottom
  const isInsideX = event.clientX >= (editorRect.left - gutterWidth) && event.clientX <= editorRect.right

  if (!isInsideY || !isInsideX) {
    showMenu.value = false
    return
  }

  // Tenta achar o elemento centralizado
  const centerEditorX = editorRect.left + (editorRect.width / 2)
  const elAtPoint = document.elementFromPoint(centerEditorX, event.clientY)
  
  let pos = null
  let blockElement = null

  if (elAtPoint) {
    blockElement = elAtPoint.closest('.tiptap > *')
    if (blockElement && view.dom.contains(blockElement)) {
      pos = view.posAtDOM(blockElement, 0)
    }
  }

  // Fallback se elementFromPoint falhar (mouse muito rápido ou área vazia)
  if (pos === null) {
    const constrainedX = event.clientX < editorRect.left ? editorRect.left + 10 : event.clientX
    const posAtCoords = view.posAtCoords({ left: constrainedX, top: event.clientY })
    if (posAtCoords) {
      pos = posAtCoords.pos
      let node = view.domAtPos(pos).node
      if (node.nodeType === 3) node = node.parentElement
      blockElement = node.closest('.tiptap > *')
    }
  }

  // Só atualiza se achou um bloco válido
  if (blockElement && pos !== null) {
    const elemRect = blockElement.getBoundingClientRect()
    showMenu.value = true
    activeNodePos.value = pos
    menuTop.value = elemRect.top - editorRect.top
  } 
}

// --- DRAG ---
const handleDragMousedown = () => {
  if (activeNodePos.value === null) return
  const { state, dispatch } = props.editor.view
  const $pos = state.doc.resolve(activeNodePos.value)
  const transaction = state.tr.setSelection(NodeSelection.create(state.doc, $pos.before(1)))
  dispatch(transaction)
}

const onDragStart = (event) => {
  showBlockMenu.value = false
  if (activeNodePos.value === null) return
  const { state } = props.editor.view
  const $pos = state.doc.resolve(activeNodePos.value)
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('tiptap/from-pos', $pos.before(1))
  const img = new Image()
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  event.dataTransfer.setDragImage(img, 0, 0)
}
const onDragEnd = () => {
  emit('drag-end') // Manda sinal pro pai limpar a linha
  showMenu.value = false // Esconde o menu visualmente
}

// --- MENU ACTIONS ---
const toggleBlockMenu = () => {
  showBlockMenu.value = !showBlockMenu.value
}
const closeBlockMenu = () => {
  showBlockMenu.value = false
}

const deleteNode = () => {
  executeAction(() => props.editor.chain().deleteSelection().run())
}

const addNode = () => {
  if (activeNodePos.value === null) return
  const { state } = props.editor.view
  const $pos = state.doc.resolve(activeNodePos.value)
  const posAfter = $pos.after(1)
  props.editor.chain().focus().insertContentAt(posAfter, { type: 'paragraph' }).run()
}

const duplicateNode = () => {
  executeAction((state, $pos) => {
    const node = state.doc.nodeAt($pos.before(1))
    const posAfter = $pos.after(1)
    props.editor.chain().insertContentAt(posAfter, node.toJSON()).run()
  })
}

const copyNodeText = () => {
  executeAction((state, $pos) => {
    const node = state.doc.nodeAt($pos.before(1))
    if (node.textContent) navigator.clipboard.writeText(node.textContent)
  })
}

const cutNode = () => {
   executeAction((state, $pos) => {
      const node = state.doc.nodeAt($pos.before(1))
      if (node.textContent) navigator.clipboard.writeText(node.textContent)
      props.editor.chain().deleteSelection().run()
   })
}

// Helper para executar ações e garantir a seleção correta
const executeAction = (callback) => {
  if (activeNodePos.value === null) return
  const { state, dispatch } = props.editor.view
  const $pos = state.doc.resolve(activeNodePos.value)
  
  // Garante seleção do nó antes de agir
  const transaction = state.tr.setSelection(NodeSelection.create(state.doc, $pos.before(1)))
  dispatch(transaction)
  
  // Executa callback
  callback(state, $pos)
  
  closeBlockMenu()
}

onMounted(() => {
  window.addEventListener('mousemove', handleWindowMouseMove)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleWindowMouseMove)
})
</script>

