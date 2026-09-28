<template>
  <BaseDropdown>
    <template #trigger="{ isOpen }">
      <button
        v-tippy="t('header.color.name')"
        class="toolbar-btn"
        :class="{ 'is-active': isColorActive || isOpen }"
        type="button"
      >
        <component :is="icons.header.color" />
        <component :is="icons.dropdown.arrow" :class="{ rotate: isOpen }" />
      </button>
    </template>

    <template #default="{ close }">
      <div class="color-dropdown-panel">
        <div class="color-section">
          <span class="color-section-title">{{ t('header.color.text') }}</span>
          <div class="color-swatches">
            <button
              v-for="color in textColors"
              :key="color.value"
              class="color-swatch-btn"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
              type="button"
              @click="applyTextColor(color.value); close()"
            ></button>
          </div>
          <div class="color-custom-row">
            <label class="color-picker-label">
              <input
                type="color"
                class="color-native-input"
                @input="onCustomTextColor($event); close()"
              />
              <span class="color-picker-text">{{ t('header.color.custom') }}</span>
            </label>
            <button
              class="color-clear-btn"
              type="button"
              @click="clearTextColor(); close()"
            >
              {{ t('header.color.reset') }}
            </button>
          </div>
        </div>

        <div class="color-divider"></div>

        <div class="color-section">
          <span class="color-section-title">{{ t('header.color.highlight') }}</span>
          <div class="color-swatches">
            <button
              v-for="color in highlightColors"
              :key="color.value"
              class="color-swatch-btn"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
              type="button"
              @click="applyHighlight(color.value); close()"
            ></button>
          </div>
          <div class="color-custom-row">
            <label class="color-picker-label">
              <input
                type="color"
                class="color-native-input"
                @input="onCustomHighlight($event); close()"
              />
              <span class="color-picker-text">{{ t('header.color.custom') }}</span>
            </label>
            <button
              class="color-clear-btn"
              type="button"
              @click="clearHighlight(); close()"
            >
              {{ t('header.color.reset') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </BaseDropdown>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseDropdown from '@/core/components/BaseDropdown.vue';
import { svgs } from '@/assets/js/svgs.js';
import { buildIcons } from '@/utils/svgFactory.js';

const props = defineProps({
  editor: { type: Object, required: true }
});

const { t } = useI18n();
const icons = buildIcons(svgs);

const textColors = [
  { name: 'Preto', value: '#1d273b' },
  { name: 'Cinza', value: '#6c757d' },
  { name: 'Azul', value: '#206bc4' },
  { name: 'Verde', value: '#2fb344' },
  { name: 'Amarelo', value: '#f59f00' },
  { name: 'Vermelho', value: '#d63939' },
  { name: 'Roxo', value: '#ae3ec9' },
  { name: 'Azul Claro', value: '#4299e1' },
];

const highlightColors = [
  { name: 'Amarelo Claro', value: '#fef08a' },
  { name: 'Verde Claro', value: '#bbf7d0' },
  { name: 'Azul Claro', value: '#bae6fd' },
  { name: 'Vermelho Claro', value: '#fecaca' },
  { name: 'Roxo Claro', value: '#e9d5ff' },
  { name: 'Laranja Claro', value: '#fed7aa' },
  { name: 'Rosa Claro', value: '#fbcfe8' },
  { name: 'Cinza Claro', value: '#e2e8f0' },
];

const isColorActive = computed(() => {
  return props.editor.isActive('textStyle') || props.editor.isActive('highlight');
});

const applyTextColor = (color) => {
  props.editor.chain().focus().setColor(color).run();
};

const clearTextColor = () => {
  props.editor.chain().focus().unsetColor().run();
};

const onCustomTextColor = (event) => {
  const color = event.target.value;
  if (color) {
    applyTextColor(color);
  }
};

const applyHighlight = (color) => {
  props.editor.chain().focus().setHighlight({ color }).run();
};

const clearHighlight = () => {
  props.editor.chain().focus().unsetHighlight().run();
};

const onCustomHighlight = (event) => {
  const color = event.target.value;
  if (color) {
    applyHighlight(color);
  }
};
</script>
