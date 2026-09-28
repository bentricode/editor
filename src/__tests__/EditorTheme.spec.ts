import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Editor from '../core/Editor.vue'
import EditorViewer from '../core/EditorViewer.vue'
import { BentricodeEditorPlugin } from '../core/plugin'

describe('Editor Theme Integration with Tabler', () => {
  const mountOptions = {
    global: {
      plugins: [BentricodeEditorPlugin]
    }
  }

  beforeEach(() => {
    document.documentElement.removeAttribute('data-bs-theme')
    document.documentElement.removeAttribute('data-bs-theme-base')
    document.body.removeAttribute('data-bs-theme')
    document.body.removeAttribute('data-bs-theme-base')
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-bs-theme')
    document.documentElement.removeAttribute('data-bs-theme-base')
    document.body.removeAttribute('data-bs-theme')
    document.body.removeAttribute('data-bs-theme-base')
  })

  it('deve aplicar dark-mode automaticamente quando data-bs-theme="dark" estiver presente no html', async () => {
    document.documentElement.setAttribute('data-bs-theme', 'dark')

    const wrapper = mount(Editor, {
      ...mountOptions,
      props: {
        modelValue: '<p>Teste</p>',
      }
    })

    await flushPromises()
    expect(wrapper.classes()).toContain('dark-mode')
  })

  it('nao deve aplicar dark-mode quando data-bs-theme="light" no html', async () => {
    document.documentElement.setAttribute('data-bs-theme', 'light')

    const wrapper = mount(Editor, {
      ...mountOptions,
      props: {
        modelValue: '<p>Teste</p>',
      }
    })

    await flushPromises()
    expect(wrapper.classes()).not.toContain('dark-mode')
  })

  it('deve respeitar prop theme="dark" explicitamente', async () => {
    document.documentElement.setAttribute('data-bs-theme', 'light')

    const wrapper = mount(Editor, {
      ...mountOptions,
      props: {
        modelValue: '<p>Teste</p>',
        theme: 'dark'
      }
    })

    await flushPromises()
    expect(wrapper.classes()).toContain('dark-mode')
  })

  it('deve respeitar prop theme="light" explicitamente', async () => {
    document.documentElement.setAttribute('data-bs-theme', 'dark')

    const wrapper = mount(Editor, {
      ...mountOptions,
      props: {
        modelValue: '<p>Teste</p>',
        theme: 'light'
      }
    })

    await flushPromises()
    expect(wrapper.classes()).not.toContain('dark-mode')
  })

  it('deve aplicar palette passada na prop como data-editor-theme-base', async () => {
    const wrapper = mount(Editor, {
      ...mountOptions,
      props: {
        modelValue: '<p>Teste</p>',
        palette: 'zinc'
      }
    })

    await flushPromises()
    expect(wrapper.attributes('data-editor-theme-base')).toBe('zinc')
  })

  it('deve aplicar dark-mode no EditorViewer quando data-bs-theme="dark"', async () => {
    document.documentElement.setAttribute('data-bs-theme', 'dark')

    const wrapper = mount(EditorViewer, {
      ...mountOptions,
      props: {
        content: '<p>Conteudo Leitura</p>'
      }
    })

    await flushPromises()
    expect(wrapper.classes()).toContain('dark-mode')
  })

  it('deve reagir dinamicamente a mutacao do atributo data-bs-theme no html', async () => {
    document.documentElement.setAttribute('data-bs-theme', 'light')

    const wrapper = mount(Editor, {
      ...mountOptions,
      props: {
        modelValue: '<p>Teste</p>',
      }
    })

    await flushPromises()
    expect(wrapper.classes()).not.toContain('dark-mode')

    document.documentElement.setAttribute('data-bs-theme', 'dark')
    await flushPromises()

    expect(wrapper.classes()).toContain('dark-mode')
  })
})
