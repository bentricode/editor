import { h } from 'vue';

const parser = new DOMParser();

/**
 * 1. Worker: Converte UMA string em UM componente
 */
const stringToComponent = (svgString) => {
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const root = doc.documentElement;

  if (root.tagName.toLowerCase() !== 'svg') {
    return () => h('span', { style: { backgroundColor: 'red',
      color: 'white', padding: '2px 4px', textAlign: 'center',
     } }, 'Icon Error');
  }

  const defaultAttrs = {};
  for (const attr of root.attributes) {
    defaultAttrs[attr.name] = attr.value;
  }

  const innerContent = root.innerHTML;

  return (props, { attrs }) => {
    // 1. Resgata as classes de ambas as origens
    const originalClass = defaultAttrs.class || '';
    const incomingClass = attrs.class || ''; // O Vue passa :class dentro de attrs aqui

    // 2. Combina as classes (evita undefined/null e adiciona espaço)
    const combinedClass = [originalClass, incomingClass].filter(Boolean).join(' ');

    // 3. Remove a chave 'class' dos objetos para não sobrescrever no spread
    const { class: _, ...restDefault } = defaultAttrs;
    const { class: __, ...restAttrs } = attrs;

    return h('svg', {
      ...restDefault, // Atributos originais (width, viewBox, etc)
      ...props,
      ...restAttrs,   // Outros atributos passados (eventos, id, style...)
      class: combinedClass, // A classe combinada entra aqui 
      innerHTML: innerContent
    });
  };
};

/**
 * 2. O Manager: Percorre o objeto com os svgs e aplica o Worker
 */
export const buildIcons = (sourceObj) => {
  const result = {};

  for (const key in sourceObj) {
    const value = sourceObj[key];

    if (typeof value === 'string') {
      // Se achou string, converte em componente
      result[key] = stringToComponent(value);
    } else if (typeof value === 'object' && value !== null) {
      // Se achou objeto, mergulha mais fundo para pegar todos os svgs
      result[key] = buildIcons(value);
    }
  }

  return result;
};