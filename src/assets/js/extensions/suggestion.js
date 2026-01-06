import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import CommandsList from '@/core/components/CommandsList.vue'

import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'
import i18n from '@/locales/i18n.ts'
const icons = buildIcons(svgs)



export default {
  items: ({ query }) => {
    const { t } = i18n.global;

    // Normaliza a busca para minúsculas
    const textQuery = query.toLowerCase();

    const commandList = [
      {
        title: t('header.text.normal'),
        searchTerms: ['p', 'texto', 'paragrafo', 'text'],
        icon: icons.header.paragraph,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setParagraph().run()
        },
      },
      {
        title: t('header.text.heading_1'),
        searchTerms: ['h1', 'titulo', 'title', '1'],
        icon: icons.header.h1,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
      },
      {
        title: t('header.text.heading_2'),
        searchTerms: ['h2', 'titulo', 'title', '2'],
        icon: icons.header.h2,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
      },
      {
        title: t('header.text.heading_3'),
        searchTerms: ['h3', 'titulo', 'title', '3'],
        icon: icons.header.h3,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
      },
      {
        title: t('header.list.bullet'),
        searchTerms: ['lista', 'topicos', 'list', 'ul'],
        icon: icons.list.unordered,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        title: t('header.code_block'),
        searchTerms: ['codigo', 'code', 'dev', 'terminal'],
        icon: icons.header.codeBlock,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
      },
      {
        title: t('header.image_upload'),
        searchTerms: ['imagem', 'foto', 'upload', 'img', 'pic'],
        icon: icons.header.imageUpload,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).addImageUploadBlock().run()
        },
      },
    ];

    // LÓGICA DE FILTRO DOS ITENS
    return commandList.filter(item => {
      // Verifica se o título CONTÉM o texto
      const inTitle = item.title.toLowerCase().includes(textQuery);

      // Verifica se algum termo de busca bate
      const inKeywords = item.searchTerms
        ? item.searchTerms.some(term => term.toLowerCase().includes(textQuery))
        : false;

      return inTitle || inKeywords;
    }).slice(0, 10);
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          // anexa direto ao editor para evitar problemas de sobreposição com outros elementos
          appendTo: () => document.querySelector('.v-bentri-editor'),

          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          theme: 'suggestion-menu',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}