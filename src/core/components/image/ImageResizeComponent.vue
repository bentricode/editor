<template>
  <node-view-wrapper 
    class="image-resizer" 
    :class="{ 'is-selected': selected }" 
    :style="alignmentStyle"
    as="div"
  >
    
    <div class="image-container" :style="{ width: node.attrs.width, height: node.attrs.height }">
      <img 
        :src="node.attrs.src" 
        :alt="node.attrs.alt" 
        class="post-image" 
        draggable="false"
      />
      
      <div class="resize-handle" @mousedown.prevent="onMouseDown"></div>
    </div>

  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref, onUnmounted, computed } from 'vue'

const props = defineProps(nodeViewProps)
const resizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

// --- Lógica de Alinhamento ---
const alignmentStyle = computed(() => {
  const align = props.node.attrs.textAlign || 'left'
  
  switch (align) {
    case 'center': return { justifyContent: 'center' }
    case 'right': return { justifyContent: 'flex-end' }
    // como 'justify' em imagens geralmente se comporta como 'center' ou 'left' 
    // esquerda/padrão mas você pode ajustar conforme necessário
    default: return { justifyContent: 'flex-start' }
  }
})

const onMouseDown = (event) => {
  resizing.value = true
  startX.value = event.clientX
  const currentWidth = event.target.closest('.image-container').offsetWidth
  startWidth.value = currentWidth

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (event) => {
  if (!resizing.value) return

  const deltaX = event.clientX - startX.value
  const editorWidth = props.editor.view.dom.offsetWidth
  const maxWidth = editorWidth - 20 
  let newWidth = startWidth.value + deltaX
  
  newWidth = Math.max(100, newWidth)
  newWidth = Math.min(maxWidth, newWidth)

  props.updateAttributes({
    width: `${newWidth}px`,
    height: 'auto'
  })
}

const onMouseUp = () => {
  resizing.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style lang="scss" >
.image-resizer {
  display: flex; 
  margin: 1.5rem 0;
  width: 100%;
  
  /* Borda roxa na IMAGEM quando selecionada */
  &.is-selected .image-container img {
    outline: 2px solid #958DF1;
  }
}

.post-image {
  margin-bottom: 0;
}

.image-container {
  position: relative;
  
  display: inline-flex; 
  line-height: 0;       
  font-size: 0;         
  
  box-sizing: border-box; 

  img {
    display: block; 
    width: 100%;
    height: auto;
    user-select: none; 
    pointer-events: auto; 
  }

  .resize-handle {
    position: absolute;
    width: 14px;
    height: 14px;
    
    bottom: -7px; 
    right: -7px;
    
    background-color: #958DF1;
    border: 2px solid white;
    border-radius: 50%;
    
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    cursor: nwse-resize;
    z-index: 20;
    
    opacity: 0;
    transition: transform 0.2s, opacity 0.2s;
  }

  .resize-handle:hover {
    transform: scale(1.2);
    background-color: #7e74e8;
  }

  /* REGRAS DE VISIBILIDADE */
  .is-selected & .resize-handle,
  .resize-handle:active {
    opacity: 1;
  }
}
</style>