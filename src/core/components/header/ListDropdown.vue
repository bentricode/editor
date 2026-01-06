<template>
  <Dropdown>
    
    <template #trigger="{ isOpen }">
      <button class="toolbar-btn" :class="{ 'is-active': isActive || isOpen }" v-tippy="$t('header.list.name')">
        <component :is="editor.isActive('orderedList') ? icons.list.ordered : icons.list.unordered" />

        <component 
          :is="icons.dropdown.arrow" 
          :class="{ 'rotate': isOpen }"
        />

      </button>
    </template>

    <template #default="{ close }">
      
      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run(); close && close()"
      >
        <component :is="icons.list.unordered"  />
        {{ t('header.list.bullet') }}
      </button>

      <button 
        class="menu-item"
        :class="{ 'is-selected': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run(); close && close()"
      >
        <component :is="icons.list.ordered"  />
       {{ t('header.list.ordered') }}
      </button>
      
    </template>

  </Dropdown>
</template>

<script setup>
import Dropdown from '@/core/components/BaseDropdown.vue'
import { computed } from 'vue'
import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const icons = buildIcons(svgs)

const props = defineProps({
  editor: { type: Object, required: true }
})

const isActive = computed(() => {
  return props.editor.isActive('bulletList') || props.editor.isActive('orderedList')
})
</script>