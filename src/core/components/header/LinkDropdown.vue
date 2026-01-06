<template>
  <Dropdown ref="dropdownRef">
    <template #trigger="{ isOpen }">
      <button 
        :class="{ 'is-active': editor.isActive('link'), 'is-open': isOpen }"
        v-tippy="$t('header.link.name')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 15l6 -6" />
            <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
            <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
        </svg>
      </button>
    </template>

    <template #default="slotProps">
      <div class="link-editor-panel">
        
        <input 
          ref="inputRef"
          v-model="href" 
          type="text" 
          :placeholder="$t('header.link.placeholder')" 
          @keydown.enter.prevent="saveLink(slotProps?.close)"
          @keydown.esc="slotProps?.close && slotProps.close()"
        />

        <div class="divider"></div>

        <div class="actions">
            <button class="action-btn confirm" @click="saveLink(slotProps?.close)" v-tippy="$t('header.link.save')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
            </button>

            <button 
                class="action-btn" 
                :class="{ 'is-active': target === '_blank' }"
                @click="toggleTarget"
                v-tippy="$t('header.link.blank')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>
            </button>
            
            <button class="action-btn delete" @click="removeLink(slotProps?.close)" v-if="editor.isActive('link')" v-tippy="'Remover link'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
            </button>
        </div>

      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import Dropdown from '@/core/components/BaseDropdown.vue'
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  editor: { type: Object, required: true }
})

const href = ref('')
const target = ref('_self')
const inputRef = ref(null)
const dropdownRef = ref(null)

// Sincroniza estado inicial ao selecionar um link existente
watch(() => props.editor.state.selection, () => {
  if (props.editor.isActive('link')) {
    const attrs = props.editor.getAttributes('link')
    href.value = attrs.href || ''
    target.value = attrs.target || '_self'
  } else {
    href.value = ''
    target.value = '_self'
  }
})

const toggleTarget = () => {
    target.value = target.value === '_blank' ? '_self' : '_blank'
}

const saveLink = (closeFn) => {
  // Verifica se a função close existe antes de chamar
  if (!href.value) {
    removeLink(closeFn)
    return
  }

  let url = href.value
  if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
      url = 'https://' + url
  }

  props.editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url, target: target.value })
    .run()

  if (closeFn) closeFn()
}

const removeLink = (closeFn) => {
  props.editor.chain().focus().unsetLink().run()
  href.value = ''
  if (closeFn) closeFn()
}
</script>

<style lang="scss" scoped>
@use "@/assets/scss/abstracts/variables" as *;

.link-editor-panel {
  display: flex;
  align-items: center;
  background-color: var(--bg-modal);
  border: 1px solid var(--border-light);
  border-radius: $radius-md;
  padding: 4px;
  box-shadow: var(--shadow-float);
  min-width: 320px;
  
  input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    padding: 6px 10px;
    font-size: 0.9rem;
    outline: none;
    min-width: 0;

    &::placeholder {
      color: var(--text-placeholder);
    }
  }

  .divider {
    width: 1px;
    height: 20px;
    background-color: var(--border-light);
    margin: 0 4px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: var(--bg-hover);
      color: var(--text-primary);
    }

    &.confirm {
      color: var(--color-brand);
      &:hover { background-color: var(--color-brand-light); }
    }

    &.delete {
      color: var(--color-danger);
      &:hover { background-color: rgba(239, 68, 68, 0.1); }
    }

    &.is-active {
      color: var(--color-brand);
      background-color: var(--color-brand-light);
    }
  }
}
</style>