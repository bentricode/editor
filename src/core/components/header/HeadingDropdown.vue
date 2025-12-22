<template>
  <BaseDropdown>
    
    <template #trigger="{ isOpen }">
      <button class="toolbar-btn" :class="{ 'is-active': isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-text-size"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7v-2h13v2" /><path d="M10 5v14" /><path d="M12 19h-4" /><path d="M15 13v-1h6v1" /><path d="M18 12v7" /><path d="M17 19h2" /></svg>
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
        :class="{ 'is-selected': editor.isActive('paragraph') }"
        @click="setParagraph(); close()"
      >
        Paragraph
      </button>

      <button 
        v-for="level in [1, 2, 3, 4, 5, 6]" 
        :key="level"
        class="menu-item"
        :class="{ 'is-selected': editor.isActive('heading', { level }) }"
        :style="{ fontSize: getFontSize(level), fontWeight: 'bold' }"
        @click="toggleHeading(level); close()"
      >
        Heading {{ level }}
      </button>
      
    </template>

  </BaseDropdown>
</template>

<script setup>
import { computed } from 'vue'
import BaseDropdown from '@/core/components/BaseDropdown.vue' 

const props = defineProps({
  editor: { type: Object, required: true }
})

const currentLabel = computed(() => {
  if (props.editor.isActive('paragraph')) return 'Paragraph'
  for (let i = 1; i <= 6; i++) {
    if (props.editor.isActive('heading', { level: i })) return `H${i}`
  }
  return 'Texto'
})

// Ações
const setParagraph = () => props.editor.chain().focus().setParagraph().run()
const toggleHeading = (level) => props.editor.chain().focus().toggleHeading({ level }).run()

const getFontSize = (level) => {
  const sizes = { 1: '1.2em', 2: '1.1em', 3: '1.05em' }
  return sizes[level] || '1em'
}
</script>

<style lang="scss" >

</style>