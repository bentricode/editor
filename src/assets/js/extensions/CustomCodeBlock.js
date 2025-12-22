import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import CodeBlockComponent from '@/core/components/CodeBlockComponent.vue'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { TextSelection } from 'prosemirror-state'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'


const lowlight = createLowlight()

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('php', php)
lowlight.register('ruby', ruby)
lowlight.register('go', go)
lowlight.register('rust', rust)
lowlight.register('json', json)
lowlight.register('bash', bash)
lowlight.register('sql', sql)


export const CodeBlockCustom = CodeBlockLowlight.extend({
    addNodeView() {
        return VueNodeViewRenderer(CodeBlockComponent)
    },
    addKeyboardShortcuts() {
        return {
            
            'Mod-a': () => {
                if (!this.editor.isActive('codeBlock')) return false

                const { state, dispatch } = this.editor.view
                const { selection, tr } = state
                const { $from } = selection

                // Seleciona todo o conteúdo do code block
                const start = $from.start()
                const end = $from.end()

                dispatch(tr.setSelection(TextSelection.create(state.doc, start, end)))
                return true
            },
            // se der enter dentro adiciona nova linha sómente dentro do code block
            'Enter': () => {
                if (!this.editor.isActive('codeBlock')) {
                    return false
                }

                // Insere uma nova linha manualmente
                this.editor.chain().command(({ tr }) => {
                    tr.insertText('\n')
                    return true
                }).run()

                return true
            }
        }
    }
}).configure({ lowlight })