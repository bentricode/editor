<template>
  <BaseDropdown>
    
    <template #trigger="{ isOpen }">
      <button 
      v-tippy="$t('header.text.name')"
      class="toolbar-btn" :class="{ 'is-active': isOpen }">
        <component :is="icons.header.text" />
        <component :is="icons.dropdown.arrow" :class="{ 'rotate': isOpen }"/>
        
      </button>
    </template>

    <template #default="{ close }">
      
      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive('paragraph') }"
        @click="setParagraph(); close()"
      >
        {{ t('header.text.normal') }}
      </button>

      <button 
        v-for="level in [1, 2, 3, 4, 5, 6]" 
        :key="level"
        class="menu-item"
        :class="{ 'is-selected': editor.isActive('heading', { level }) }"
        :style="{ fontSize: getFontSize(level), fontWeight: 'bold' }"
        @click="toggleHeading(level); close()"
      >
        {{ t(`header.text.heading_${level}`) }} 
      </button>
      
    </template>

  </BaseDropdown>
</template>

<script setup>
import { computed } from 'vue'
import BaseDropdown from '@/core/components/BaseDropdown.vue' 
import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const icons = buildIcons(svgs)
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