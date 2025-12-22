<template>
  <node-view-wrapper class="image-upload-wrapper">
    <div 
      class="upload-placeholder"
      @dragover.stop.prevent="onDragOver" 
      @dragleave.stop.prevent="onDragLeave"
      @drop.stop.prevent="onDrop"
      @click="triggerInput"
      :class="{ 'is-dragging': isDragging }"
    >
      <input type="file" ref="fileInput" hidden accept="image/*" @change="onFileChange" />
      
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      </div>
      <span class="text" v-if="!isDragging">Arraste uma imagem ou clique para upload</span>
      <span class="text" v-else>Solte para inserir</span>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref } from 'vue'

const props = defineProps(nodeViewProps)
const fileInput = ref(null)
const isDragging = ref(false)

const triggerInput = () => fileInput.value?.click()

const onDragOver = () => { isDragging.value = true }
const onDragLeave = () => { isDragging.value = false }

const handleImage = (file) => {
  if (!file || !file.type.startsWith('image/')) return

  const url = URL.createObjectURL(file)

  if (typeof props.getPos === 'function') {
    props.editor.chain()
      .focus()
      // seleciona o nó na posição correta
      .setNodeSelection(props.getPos())
      // insere a imagem
      .setImage({ src: url, width: '400px' }) 
      .run()
  }
}

const onDrop = (e) => {
  isDragging.value = false
  if (e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0]
    handleImage(file)
  }
}

const onFileChange = (e) => {
  if (e.target.files.length > 0) {
    const file = e.target.files[0]
    handleImage(file)
  }
}
</script>

<style lang="scss" >

</style>