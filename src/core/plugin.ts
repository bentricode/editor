import type { App } from 'vue';

import VueTippy from 'vue-tippy';
import i18n from '@/locales/i18n.ts'
// Estilos
import '@/assets/scss/main.scss'; // O SCSS global
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

/*
 * Bentricode Editor Plugin
 * * Responsabilidades:
 * - Configurar VueTippy com a lógica de Z-Index/Fullscreen
 * - Importar estilos globais
 * - Instalar i18n
 */
export const BentricodeEditorPlugin = {
  install: (app: App) => {

    // Configura i18n
    app.use(i18n);

    // Configura VueTippy 
    app.use(VueTippy, {
      directive: 'tippy',
      component: 'tippy',
      defaultProps: {

        appendTo: () => {
          // Procura o editor na tela
          const editor = document.querySelector('.v-bentri-editor');
          
          // Se estiver em fullscreen (editor existe), joga o tooltip dentro dele
          // Se não, joga no body normal
          return editor || document.body;
        },
      }
    });


  }
};