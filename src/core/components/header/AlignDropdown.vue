<template>
  <BaseDropdown>
    
    <template #trigger="{ isOpen }">
      <button class="toolbar-btn" :class="{ 'is-active': isOpen }" title="Alinhamento do Texto">
        <component :is="currentIcon" />
        <component :is="icons.dropdown.arrow" 
          :class="{ 'rotate': isOpen }"
        />
        
      </button>
    </template>

    <template #default="{ close }">
      
      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'left' }) }"
        @click="setAlignment('left'); close()"
      >
        <component :is="icons.align.left" /> Esquerda
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'center' }) }"
        @click="setAlignment('center'); close()"
      >
        <component :is="icons.align.center" /> Centralizar
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'right' }) }"
        @click="setAlignment('right'); close()"
      >
        <component :is="icons.align.right" /> Direita
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive({ textAlign: 'justify' }) }"
        @click="setAlignment('justify'); close()"
      >
        <component :is="icons.align.justify" /> Justificado
      </button>

    </template>

  </BaseDropdown>
</template>

<script setup>
import { computed, h } from 'vue'
import BaseDropdown from '@/core/components/BaseDropdown.vue' 
import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'

const icons = buildIcons(svgs)


const props = defineProps({
  editor: { type: Object, required: true }
})


// Determina qual ícone mostrar no botão principal
const currentIcon = computed(() => {
  if (props.editor.isActive({ textAlign: 'center' })) return icons.align.center
  if (props.editor.isActive({ textAlign: 'right' })) return icons.align.right
  if (props.editor.isActive({ textAlign: 'justify' })) return icons.align.justify
  return icons.align.left // Padrão
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