# 🚀 Bentricode Editor

https://github.com/user-attachments/assets/c1a470c0-f8f9-4581-8499-71590d9c2e8d

## A experiência "Notion-like" para suas aplicações Vue.js

O @bentricode/editor é uma solução de edição de texto construída sobre o ecossistema Tiptap. Projetado para oferecer uma experiência de escrita fluida e moderna, ele remove a complexidade de configurar extensões, menus flutuantes e gerenciamento de blocos, permitindo que você foque no que importa: o conteúdo da sua aplicação.

Por que usar o Bentricode Editor?
- ✨ Interface Moderna: Menu de comandos (/), menus flutuantes (Bubble Menu) e arraste de blocos (Drag & Drop).

- 🎨 Temas Prontos: Suporte nativo a Dark Mode e múltiplas paletas de cores (Slate, Zinc, Gray, etc.).

- 🖼️ Gestão de Imagens Inteligente: Uploads locais via Blob com fluxo claro para persistência no servidor.

- 🧱 Blocos de Código: Syntax Highlighting com botão de cópia integrado.

- ⚡ Leve e Modular: Inclui um componente Viewer otimizado apenas para leitura.

📦 Instalação
```bash
npm install @bentricode/editor
```
O pacote possui dois componentes principais:

1. Editor: Componente completo para criação e edição de conteúdo.

2. EditorViewer: Componente leve para renderizar e exibir o conteúdo salvo.

🛠️ Uso Básico: 

Basta importar o componente e vincular ao seu estado usando ```v-model```.

```html
<template>
   <Editor v-model="content" />
</template>

<script setup>
  import { Editor } from '@bentricode/editor';
  import { ref } from 'vue';

  const content = ref('');
</script>
```

⚙️ Configuração da Barra de Ferramentas (Toolbar)

O editor vem "baterias inclusas", exibindo todas as ferramentas por padrão. Você pode restringir ou reordenar as ferramentas através da prop ```options```.

itens disponíveis por padrão:
- Histórico: ```undo```, ```redo```

- Formatação: ```bold```, ```italic```, ```strikethrough```, ```code```

- Blocos: ```list```, ```blockQuote```, ```codeBlock```, ```imageUpload```

- Estrutura: ```align```, ```link```, ```text```

mas você pode também separar em grupos colocando separadores ```separator``` em locais estratégicos que cria uma barrinha vertical entre os elementos.

exemplo personalizado:
```html
<template>
   <Editor v-model="content" :options="editorOptions" />
</template>

<script setup>
  const editorOptions = {
    toolbar: {
        // Apenas negrito, itálico e listas
        items: ['bold', 'italic', 'separator', 'list']
    }
  };
</script>
```
Configuração de Links e Protocolos

Por padrão, links inseridos aceitam apenas ```http``` e ```https```. Se sua aplicação precisa suportar outros protocolos (como ```ssh``` ou ```ftp```), configure via ```options```:

```js
const editorOptions = {
    link: {
        protocols: ['http', 'https', 'ssh', 'ftp'], 
    }
};
```

🎨 Temas e Aparência

O editor se adapta ao design system da sua aplicação. Utilize theme para alternar entre claro/escuro e palette para ajustar as cores ao seu gosto (cores baseadas no padrão Tabler).

- Themes: ```light``` (padrão), ```dark```.

- Palettes: ```slate``` (padrão), ```gray```, ```zinc```, ```neutral```, ```stone```, ```elegant```.

```html
<Editor v-model="content" theme="dark" palette="zinc" />
```


🖼️ Gerenciamento e Upload de Imagens

O Bentricode Editor utiliza uma abordagem de Optimistic UI. Imagens arrastadas ou coladas são exibidas imediatamente usando URLs locais (```Blob```), garantindo zero latência para o usuário.

Para salvar o conteúdo, você deve processar esses Blobs e trocá-los pelas URLs definitivas do seu servidor.
### Fluxo de Salvamento

O componente expõe métodos via ```ref``` para facilitar esse processo:

1.   ```getPendingBlobs()```: Retorna lista de imagens que ainda não foram enviadas.

2.   ```updateImageUrls()```: Substitui as URLs locais (```blob:```) pelas URLs do servidor.

```html
<template>
    <Editor ref="editorRef" v-model="content" />
    <button @click="savePost">Publicar</button>
</template>

<script setup>
import { ref } from 'vue';
import { Editor } from '@bentricode/editor';
import { api } from '@/services/api'; // Exemplo

const editorRef = ref();
const content = ref('');

async function savePost() {
    // ... lógica de validação ...
    /* 
    depois da validação você antes de slavar o conteúdo do editor, 
    salva cada imagem e troca os blobs por urls definitivas
    */

    // 1. Detectar imagens pendentes de serem salvas (todas que ainda possuem url local)
    const pendingBlobs = editorRef.value.getPendingBlobs();
    
    if (pendingBlobs.length > 0) {
        const replacements = {};

        // 2. Upload paralelo das imagens
        await Promise.all(pendingBlobs.map(async (blobUrl) => {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            
            const formData = new FormData();
            formData.append('file', blob);

            const { data } = await api.post('/uploads', formData);
            
            // Mapeia: Blob Local -> URL Servidor
            replacements[blobUrl] = data.url;
        }));

        // 3. Atualiza o editor com as URLs reais
        editorRef.value.updateImageUrls(replacements);
    }

    // 4. Salva o HTML final (agora com links permanentes)
    const finalHtml = editorRef.value.getHTML();
    await api.post('/posts', { content: finalHtml });
}
</script>
```

## 👁️ Modo Leitura (Viewer)

Para exibir o conteúdo gerado, evite usar ```v-html``` puro. O componente ```EditorViewer``` garante que estilos de blocos de código, listas e alinhamentos sejam renderizados exatamente como no editor, mas de forma leve e segura.

```html
<template>
   <EditorViewer :content="content" />
</template>

<script setup>
  import { EditorViewer } from '@bentricode/editor';
  const content = ref('<p>Conteúdo vindo da API...</p>');
</script>
```
✅ Validação de Formulários

O editor integra-se perfeitamente com bibliotecas de validação. Abaixo um exemplo utilizando a biblioteca **[v-required](https://www.npmjs.com/package/v-required)** para validação.

-   isEmpty(): Retorna ```true``` se o editor não tiver conteúdo visível.

-    hasPendingUploads(): Retorna ```true``` se houver blocos de imagem em estado de carregamento ou vazios.

### Exemplo de validação com v-required:
```html
<v-required name="conteudo">
     <Editor ref="editorRef" v-model="content" />
     
     <v-rule 
        message="O conteúdo não pode estar vazio." 
        :error="() => editorRef?.isEmpty()" 
     />
     
     <v-rule 
        message="Aguarde o carregamento das imagens." 
        :error="() => editorRef?.hasPendingUploads()" 
     />
</v-required>
```


🌐 Internacionalização (i18n)

O editor suporta múltiplos idiomas nativamente para tooltips e placeholders.

Atualmente, os idiomas suportados são:

-    Português Brasileiro (```pt-br```) — Padrão

-    Inglês (```en```)

Para alterar o idioma, basta utilizar a prop ```locale```. A propriedade é reativa, ou seja, se a sua aplicação mudar de idioma dinamicamente, o editor acompanhará a mudança instantaneamente.

```html
<Editor v-model="content" locale="en" />
```

## Lembrando que os temas e options de link precisam ser redefinidos no visualizador

- no caso do link se quiser ssh precisa ser definido por que o tiptap por padrão não aceita ssh 
- o tema e paleta deve ser definido para manter consistencia

```html
<template>
    <EditorViewer :content="artigo_conteudo" :options="options" 
    :theme="theme" :palette="themePalette"
    />
</template>

<script setup lang="ts">
  import { EditorViewer } from '@bentricode/editor';
  import { ref } from 'vue';
  const editor_conteudo = ref('vem da api')
  const themePalette = 'zinc';
  const theme = 'dark';
  const options = {
      link: {
          protocols: ['http', 'https', 'ssh'], // Protocolos permitidos
      }
  };
</script>
```

## 📚 API Reference

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `v-model` | `String` | `''` | Conteúdo do editor. |
| `theme` | `String` | `'light'` | Tema visual do editor (`light` ou `dark`). |
| `palette` | `String` | `'slate'` | Cores do tema dark (`slate`, `zinc`, `gray`, `neutral`, `stone`, `elegant`). |
| `locale` | `String` | `'pt-br'` | Idioma da interface (`pt-br` ou `en`). |
| `options` | `Object` | `{}` | Objeto para configurações avançadas da toolbar e protocolos de link. |
