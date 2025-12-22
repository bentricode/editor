<template>
  <BaseDropdown>
    
    <template #trigger="{ isOpen }">
      <button class="toolbar-btn" :class="{ 'is-active': isOpen }" title="Alinhamento do Texto">
        <component :is="currentIcon" />
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="arrow-icon"
          :class="{ 'rotate': isOpen }"
        >
          <path d="M6 9l6 6l6 -6" />
        </svg>
      </button>
    </template>

    <template #default="{ close }">
      
      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'left' }) }"
        @click="setAlignment('left'); close()"
      >
        <IconLeft /> Esquerda
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'center' }) }"
        @click="setAlignment('center'); close()"
      >
        <IconCenter /> Centralizar
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'right' }) }"
        @click="setAlignment('right'); close()"
      >
        <IconRight /> Direita
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'justify' }) }"
        @click="setAlignment('justify'); close()"
      >
        <IconJustify /> Justificado
      </button>

    </template>

  </BaseDropdown>
</template>

<script setup>
import { computed, h } from 'vue'
import BaseDropdown from '@/core/components/BaseDropdown.vue' 

const props = defineProps({
  editor: { type: Object, required: true }
})

// --- ÍCONES SVGs  ---
const IconLeft = () => h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", "stroke-width":"2", "stroke-linecap":"round", "stroke-linejoin":"round" }, [ h('path', { d:"M3 6h18" }), h('path', { d:"M3 12h12" }), h('path', { d:"M3 18h18" }) ])
const IconCenter = () => h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", "stroke-width":"2", "stroke-linecap":"round", "stroke-linejoin":"round" }, [ h('path', { d:"M3 6h18" }), h('path', { d:"M6 12h12" }), h('path', { d:"M3 18h18" }) ])
const IconRight = () => h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", "stroke-width":"2", "stroke-linecap":"round", "stroke-linejoin":"round" }, [ h('path', { d:"M3 6h18" }), h('path', { d:"M9 12h12" }), h('path', { d:"M3 18h18" }) ])
const IconJustify = () => h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", "stroke-width":"2", "stroke-linecap":"round", "stroke-linejoin":"round" }, [ h('path', { d:"M3 6h18" }), h('path', { d:"M3 12h18" }), h('path', { d:"M3 18h18" }) ])

// Determina qual ícone mostrar no botão principal
const currentIcon = computed(() => {
  if (props.editor.isActive({ textAlign: 'center' })) return IconCenter
  if (props.editor.isActive({ textAlign: 'right' })) return IconRight
  if (props.editor.isActive({ textAlign: 'justify' })) return IconJustify
  return IconLeft // Padrão
})

const setAlignment = (align) => {
  props.editor.chain().focus().setTextAlign(align).run()
}
</script>

<style lang="scss" >
.toolbar-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #374151;
  transition: all 0.2s;

  &:hover, &.is-active {
    background-color: #f3f4f6;
  }

  .arrow-icon {
    opacity: 0.6;
    transition: transform 0.2s;
    &.rotate {
      transform: rotate(180deg);
    }
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px; 
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
  color: #374151;

  &:hover {
    background-color: #f3f4f6;
  }

  &.is-selected {
    background-color: #e0e7ff;
    color: #4f46e5;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}
</style>