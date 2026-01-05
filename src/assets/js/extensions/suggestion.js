import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import CommandsList from '@/core/components/CommandsList.vue'

import { svgs } from '@/assets/js/svgs.js'
import { buildIcons } from '@/utils/svgFactory.js'
const icons = buildIcons(svgs)


export default {
  items: ({ query }) => {
    return [
      {
        title: 'Heading 1',
        icon: icons.header.h1,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
      },
      {
        title: 'Heading 2',
        icon: icons.header.h2,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
      },
      {
        title: 'Bullet List',
        icon: icons.list.unordered,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        title: 'Code Block',
        icon: icons.header.codeBlock,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
      },
      {
        title: 'Image',
        icon: icons.header.imageUpload,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).addImageUploadBlock().run()
        },
      },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
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
          appendTo: () => document.querySelector('.v-bentri-editor') ,

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