import { Node, mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageResizeComponent from '@/core/components/image/ImageResizeComponent.vue'
import ImageUploadComponent from '@/core/components/image/ImageUploadComponent.vue'

// Extensão para a Imagem FINAL (Com Resize)
export const ResizableImage = Image.extend({
  draggable: true,
  inline: false, 
  // allowBase64: true
  group: 'block', // Tornar a imagem um bloco
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: attributes => ({
          height: attributes.height,
        }),
      },
    }
  },
  
  addNodeView() {
    return VueNodeViewRenderer(ImageResizeComponent)
  },
})

// Extensão para o BLOCO DE UPLOAD (Temporário)
export const ImageUploadBlock = Node.create({
  name: 'imageUpload',
  
  group: 'block',
  
  
  atom: true, // É um bloco único, não tem conteúdo editável dentro
  
  addAttributes() {
    return {}
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-upload"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })]
  },
  
  addNodeView() {
    return VueNodeViewRenderer(ImageUploadComponent,{
      // Essa função diz ao Tiptap quais eventos ele deve IGNORAR
      // e deixar o componente Vue resolver sozinho.
      stopEvent: ({ event }) => {
        // Se for qualquer evento de drag ou drop, o Tiptap não se mete
        return event.type.startsWith('drag') || event.type === 'drop'
      },
    })
  },
  
  // Comando para inserir este bloco
  addCommands() {
    return {
      addImageUploadBlock: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
        })
      },
    }
  },
})