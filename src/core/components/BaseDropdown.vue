<template>
  <div class="dropdown-wrapper" ref="containerRef">
    
    <div class="dropdown-trigger" @click="toggle" ref="triggerRef">
      <slot name="trigger" :isOpen="isOpen"></slot>
    </div>

    <div 
      v-show="isOpen" 
      class="dropdown-content"
      :class="{ 'align-right': alignRight }"
    >
      <slot :close="close"></slot>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const alignRight = ref(false)
const containerRef = ref(null)
const triggerRef = ref(null)

const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const open = () => {
  // Se o botão estiver na metade direita da tela, abre pra esquerda.
  // Se estiver na metade esquerda, abre pra direita.
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect()
    const windowWidth = window.innerWidth
    
    // Se o centro do botão passou da metade da tela
    if (rect.left > windowWidth / 2) {
      alignRight.value = true
    } else {
      alignRight.value = false
    }
  }
  
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

// Fecha ao clicar fora
const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0; /* Padrão: Alinha à esquerda do botão */
  z-index: 50;
  margin-top: 4px;
  min-width: max-content; /* Garante que o menu caiba o texto */
}

/* Quando ativo, cola na direita do botão e cresce pra esquerda */
.dropdown-content.align-right {
  left: auto;
  right: 0;
}
</style>