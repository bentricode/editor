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
        <component :is="icons.header.imageUpload" />
      </div>
      <span class="text" v-if="!isDragging">{{t('header.image.drag')}}</span>
      <span class="text" v-else>{{t('header.image.drop')}}</span>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'
const { t } = useI18n()

const icons = buildIcons(svgs)

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