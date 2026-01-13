<template>
  <node-view-wrapper class="bentri-code-block group">

    <div class="lang-select" contenteditable="false">
      
      <select 
        v-if="editor.isEditable"
        v-model="selectedLanguage"
      >
        <option value="">auto</option>
        <option v-for="(language, index) in languages" :value="language" :key="index">
          {{ language }}
        </option>
      </select>

      <button 
        v-else 
        class="btn-copy" 
        @click="copyToClipboard"
        :class="{ 'copied': isCopied }"
        title="Copiar código"
      >
        <svg v-if="!isCopied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        
        <span>{{ isCopied ? 
        t('code_block.copied')
        : t('code_block.copy') }}</span>
      </button>

    </div>

    <pre><node-view-content as="code" /></pre>
    
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps(nodeViewProps)

// Pega as linguagens disponíveis na extensão lowlight configurada no editor
const languages = props.extension.options.lowlight.listLanguages()
const isCopied = ref(false)

// Computada para ler/gravar a linguagem no atributo do nó
const selectedLanguage = computed({
  get() {
    return props.node.attrs.language || ''
  },
  set(language) { 
    props.updateAttributes({ language: language === '' ? null : language }) 
  },
})

// --- FUNÇÃO DE COPIAR ---
const copyToClipboard = () => {
  // Pega o conteúdo de texto cru do nó (sem tags HTML)
  const codeContent = props.node.textContent
  
  navigator.clipboard.writeText(codeContent).then(() => {
    isCopied.value = true
    
    // Reseta o estado após 2 segundos
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }).catch(err => {
    console.error('Falha ao copiar:', err)
  })
}
</script>

