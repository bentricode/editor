declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Define que todo arquivo .vue é um componente genérico
  const component: DefineComponent<{}, {}, any>
  export default component
}