<template>
    <div class="command-list-items">
        <div class="header-title" v-if="items.length > 0">
            Sugestões
        </div>

        <div class="scroller">
            <button 
                class="item" 
                :class="{ 'is-selected': index === selectedIndex }" 
                v-for="(item, index) in items"
                :key="index" 
                @click="selectItem(index)" 
                @mouseenter="selectedIndex = index"
                :ref="(el) => itemRefs[index] = el"
            >
                <div v-if="item.icon" class="icon">
                     <component :is="item.icon" />
                </div>

                <div class="label">{{ item.title }}</div>
            </button>
        </div>

        <div class="no-result" v-if="items.length === 0">
            Sem resultados
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    command: {
        type: Function,
        required: true,
    },
})

const selectedIndex = ref(0)
const itemRefs = ref([]) 

// Resetar seleção quando a lista muda
watch(() => props.items, () => {
    selectedIndex.value = 0
})

const selectItem = (index) => {
    const item = props.items[index]
    if (item) {
        props.command(item)
    }
}

// === LÓGICA DE TECLADO ===

const onKeyDown = ({ event }) => {
    if (event.key === 'ArrowUp') {
        upHandler()
        return true
    }
    if (event.key === 'ArrowDown') {
        downHandler()
        return true
    }
    if (event.key === 'Enter') {
        enterHandler()
        return true
    }
    return false
}

const upHandler = () => {
    selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
    scrollToSelected()
}

const downHandler = () => {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    scrollToSelected()
}

const enterHandler = () => {
    selectItem(selectedIndex.value)
}

// === AUTO SCROLL ===
// Faz o menu rolar sozinho para acompanhar a seleção do teclado
const scrollToSelected = () => {
    nextTick(() => {
        const selectedElement = itemRefs.value[selectedIndex.value]
        if (selectedElement) {
            // scrollIntoView com 'nearest' evita pular a tela inteira, só ajusta se necessário
            selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    })
}

defineExpose({ onKeyDown })
</script>