<template>
  <bubble-menu class="container-tip-float" :editor="editor" :should-show="shouldShowTextMenu">
    <div class="bubble-menu text-menu">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <component :is="icons.header.bold" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <component :is="icons.header.italic" />
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <component :is="icons.header.strikethrough" />
      </button>

      <div class="divider"></div>

      <button
        @click="toggleQuickHighlight"
        :class="{ 'is-active': editor.isActive('highlight') }"
        v-tippy="t('header.color.highlight')"
      >
        <component :is="icons.header.color" />
      </button>

      <button
        @click="clearFormatting"
        v-tippy="t('header.clear_formatting')"
      >
        <component :is="icons.header.clearFormatting" />
      </button>
    </div>
  </bubble-menu>

  <bubble-menu class="container-tip-float" :editor="editor" :should-show="shouldShowTableMenu">
    <div class="bubble-menu table-menu">
      <button
        @click="editor.chain().focus().addRowBefore().run()"
        v-tippy="t('header.table.add_row_before')"
      >
        <component :is="icons.header.tableAddRowBefore" />
      </button>
      <button
        @click="editor.chain().focus().addRowAfter().run()"
        v-tippy="t('header.table.add_row_after')"
      >
        <component :is="icons.header.tableAddRowAfter" />
      </button>
      <button
        @click="editor.chain().focus().deleteRow().run()"
        class="text-danger"
        v-tippy="t('header.table.delete_row')"
      >
        <component :is="icons.header.tableDeleteRow" />
      </button>

      <div class="divider"></div>

      <button
        @click="editor.chain().focus().addColumnBefore().run()"
        v-tippy="t('header.table.add_column_before')"
      >
        <component :is="icons.header.tableAddColBefore" />
      </button>
      <button
        @click="editor.chain().focus().addColumnAfter().run()"
        v-tippy="t('header.table.add_column_after')"
      >
        <component :is="icons.header.tableAddColAfter" />
      </button>
      <button
        @click="editor.chain().focus().deleteColumn().run()"
        class="text-danger"
        v-tippy="t('header.table.delete_column')"
      >
        <component :is="icons.header.tableDeleteCol" />
      </button>

      <div class="divider"></div>

      <button
        @click="editor.chain().focus().toggleHeaderRow().run()"
        v-tippy="t('header.table.toggle_header_row')"
      >
        <component :is="icons.header.tableHeader" />
      </button>
      <button
        @click="editor.chain().focus().deleteTable().run()"
        class="text-danger"
        v-tippy="t('header.table.delete_table')"
      >
        <component :is="icons.header.tableDelete" />
      </button>
    </div>
  </bubble-menu>

  <bubble-menu class="container-tip-float" :editor="editor" :should-show="shouldShowImageMenu">
    <div class="bubble-menu image-menu">
      <button
        @click="replaceImageWithUpload"
        class="btn-replace"
        v-tippy="t('header.image.trade')"
      >
        <component :is="icons.replace" />
      </button>

      <div class="divider"></div>

      <button
        @click="deleteSelectedImage"
        class="btn-delete"
        v-tippy="t('header.image.remove')"
      >
        <component :is="icons.trash" />
      </button>
    </div>
  </bubble-menu>
</template>

<script setup>
import { BubbleMenu } from '@tiptap/vue-3/menus';
import { svgs } from '@/assets/js/svgs.js';
import { buildIcons } from '@/utils/svgFactory.js';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  editor: { type: Object, required: true }
});

const { t } = useI18n();
const icons = buildIcons(svgs);

const shouldShowTextMenu = ({ editor, state }) => {
  if (state.selection.empty) return false;
  if (editor.isActive('image')) return false;
  if (editor.isActive('codeBlock')) return false;
  if (editor.isActive('imageUpload')) return false;
  return true;
};

const shouldShowTableMenu = ({ editor }) => {
  return editor.isActive('table');
};

const shouldShowImageMenu = ({ editor }) => {
  return editor.isActive('image');
};

const toggleQuickHighlight = () => {
  if (props.editor.isActive('highlight')) {
    props.editor.chain().focus().unsetHighlight().run();
    return;
  }
  props.editor.chain().focus().setHighlight({ color: '#fef08a' }).run();
};

const clearFormatting = () => {
  if (!props.editor) return;
  props.editor.chain().focus().unsetAllMarks().clearNodes().run();
};

const replaceImageWithUpload = () => {
  if (!props.editor) return;
  props.editor.chain().focus().addImageUploadBlock().run();
};

const deleteSelectedImage = () => {
  if (!props.editor) return;
  props.editor.chain().focus().deleteSelection().run();
};
</script>