<template>
  <node-view-wrapper class="bentri-block">
    
    <div class="bentri-actions bridge-area" contenteditable="false" data-drag-handle>
      <div class="bentri-actions-group">
        
        <button @click="deleteNode()" class="action-btn delete" title="Deletar bloco">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
        </button>

        <div class="action-handle">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
        </div>

        <button @click="createNodeAfter" class="action-btn add" title="Novo bloco abaixo">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
        </button>

      </div>
    </div>

    <node-view-content class="bentri-content" />

  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const createNodeAfter = () => {
  // Verificação de segurança
  if (typeof props.getPos !== 'function') return

  const { state } = props.editor

  const $pos = state.doc.resolve(props.getPos())

  // Profundidade (Depth)
  // Depth 0 = Documento (Raiz absoluta)
  // Depth 1 = O bloco principal (Blockquote, Lista, ou Parágrafo solto)
  // Depth 2 = O conteúdo dentro (ex: o Texto dentro do Blockquote)
  
  // Usamos .after(1) para pegar a posição EXATAMENTE APÓS o bloco de nível 1.
  // Isso garante que ele sempre pule para fora do Blockquote, Lista ou Codeblock.
  const posAfterRoot = $pos.after(1)

  props.editor.chain()
    .focus()
    // Insere o parágrafo na raiz, fora de qualquer container
    .insertContentAt(posAfterRoot, { type: 'paragraph' })
    .scrollIntoView()
    .run()
}
</script>

