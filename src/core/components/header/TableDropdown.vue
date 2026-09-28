<template>
  <BaseDropdown>
    <template #trigger="{ isOpen }">
      <button
        v-tippy="t('header.table.name')"
        class="toolbar-btn"
        :class="{ 'is-active': isInTable || isOpen }"
        type="button"
      >
        <component :is="icons.header.table" />
        <component :is="icons.dropdown.arrow" :class="{ rotate: isOpen }" />
      </button>
    </template>

    <template #default="{ close }">
      <div class="table-dropdown-panel">
        <template v-if="!isInTable">
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="insertTable(3, 3); close()"
          >
            <component :is="icons.header.table" />
            <span>{{ t('header.table.insert') }} (3x3)</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="insertTable(4, 4); close()"
          >
            <component :is="icons.header.table" />
            <span>{{ t('header.table.insert') }} (4x4)</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="insertTable(2, 2); close()"
          >
            <component :is="icons.header.table" />
            <span>{{ t('header.table.insert') }} (2x2)</span>
          </button>
        </template>

        <template v-else>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="addRowBefore(); close()"
          >
            <component :is="icons.header.tableAddRowBefore" />
            <span>{{ t('header.table.add_row_before') }}</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="addRowAfter(); close()"
          >
            <component :is="icons.header.tableAddRowAfter" />
            <span>{{ t('header.table.add_row_after') }}</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2 text-danger"
            type="button"
            @click="deleteRow(); close()"
          >
            <component :is="icons.header.tableDeleteRow" />
            <span>{{ t('header.table.delete_row') }}</span>
          </button>

          <div class="color-divider"></div>

          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="addColumnBefore(); close()"
          >
            <component :is="icons.header.tableAddColBefore" />
            <span>{{ t('header.table.add_column_before') }}</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="addColumnAfter(); close()"
          >
            <component :is="icons.header.tableAddColAfter" />
            <span>{{ t('header.table.add_column_after') }}</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2 text-danger"
            type="button"
            @click="deleteColumn(); close()"
          >
            <component :is="icons.header.tableDeleteCol" />
            <span>{{ t('header.table.delete_column') }}</span>
          </button>

          <div class="color-divider"></div>

          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="toggleHeaderRow(); close()"
          >
            <component :is="icons.header.tableHeader" />
            <span>{{ t('header.table.toggle_header_row') }}</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="mergeCells(); close()"
          >
            <component :is="icons.header.tableMerge" />
            <span>{{ t('header.table.merge_cells') }}</span>
          </button>
          <button
            class="menu-item d-flex align-items-center gap-2"
            type="button"
            @click="splitCell(); close()"
          >
            <component :is="icons.header.tableSplit" />
            <span>{{ t('header.table.split_cell') }}</span>
          </button>

          <div class="color-divider"></div>

          <button
            class="menu-item d-flex align-items-center gap-2 text-danger"
            type="button"
            @click="deleteTable(); close()"
          >
            <component :is="icons.header.tableDelete" />
            <span>{{ t('header.table.delete_table') }}</span>
          </button>
        </template>
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

const isInTable = computed(() => {
  return props.editor.isActive('table');
});

const insertTable = (rows, cols) => {
  props.editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
};

const addRowBefore = () => {
  props.editor.chain().focus().addRowBefore().run();
};

const addRowAfter = () => {
  props.editor.chain().focus().addRowAfter().run();
};

const deleteRow = () => {
  props.editor.chain().focus().deleteRow().run();
};

const addColumnBefore = () => {
  props.editor.chain().focus().addColumnBefore().run();
};

const addColumnAfter = () => {
  props.editor.chain().focus().addColumnAfter().run();
};

const deleteColumn = () => {
  props.editor.chain().focus().deleteColumn().run();
};

const toggleHeaderRow = () => {
  props.editor.chain().focus().toggleHeaderRow().run();
};

const mergeCells = () => {
  props.editor.chain().focus().mergeCells().run();
};

const splitCell = () => {
  props.editor.chain().focus().splitCell().run();
};

const deleteTable = () => {
  props.editor.chain().focus().deleteTable().run();
};
</script>
