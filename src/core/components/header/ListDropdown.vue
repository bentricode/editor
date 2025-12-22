<template>
  <Dropdown>
    
    <template #trigger="{ isOpen }">
      <button class="toolbar-btn" :class="{ 'is-active': isActive || isOpen }" v-tippy="'Listas'">
        <svg v-if="editor.isActive('orderedList')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 6h9" /><path d="M11 12h9" /><path d="M12 18h8" /><path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" /><path d="M6 10v-6l-2 2" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" />
        </svg>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
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
        :class="{ 'is-selected': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run(); close && close()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; opacity: 0.7;"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>
        Lista com Marcadores
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run(); close && close()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; opacity: 0.7;"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 6h9" /><path d="M11 12h9" /><path d="M12 18h8" /><path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" /><path d="M6 10v-6l-2 2" /></svg>
        Lista Numerada
      </button>
      
    </template>

  </Dropdown>
</template>

<script setup>
import Dropdown from '@/core/components/BaseDropdown.vue'
import { computed } from 'vue'

const props = defineProps({
  editor: { type: Object, required: true }
})

const isActive = computed(() => {
  return props.editor.isActive('bulletList') || props.editor.isActive('orderedList')
})
</script>