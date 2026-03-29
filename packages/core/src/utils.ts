import type { PlaygroundState, PlaygroundAction, PropDefinition } from './types';

/**
 * Reducer para gerenciar estado do playground
 */
export function playgroundReducer(
  state: PlaygroundState,
  action: PlaygroundAction
): PlaygroundState {
  switch (action.type) {
    case 'UPDATE_PROP':
      return {
        ...state,
        props: {
          ...state.props,
          [action.key]: action.value,
        },
      };

    case 'TOGGLE_CODE':
      return {
        ...state,
        showCode: !state.showCode,
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };

    case 'RESET':
      return {
        props: {},
        showCode: false,
        theme: 'light',
      };

    default:
      return state;
  }
}

/**
 * Gera props iniciais baseado nas definições
 */
export function generateInitialProps(
  propsDefinition: Record<string, PropDefinition>
): Record<string, any> {
  const initialProps: Record<string, any> = {};

  Object.entries(propsDefinition).forEach(([key, definition]) => {
    if (definition.defaultValue !== undefined) {
      initialProps[key] = definition.defaultValue;
    } else if (definition.required) {
      // Gera valores padrão para props obrigatórias
      initialProps[key] = getDefaultValueForType(definition);
    }
  });

  return initialProps;
}

/**
 * Gera valor padrão baseado no tipo
 */
function getDefaultValueForType(definition: PropDefinition): any {
  switch (definition.type) {
    case 'string':
      return definition.options?.[0] || '';
    case 'number':
      return definition.min || 0;
    case 'boolean':
      return false;
    default:
      return undefined;
  }
}

/**
 * Valida props contra definições
 */
export function validateProps(
  props: Record<string, any>,
  propsDefinition: Record<string, PropDefinition>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Verifica props obrigatórias
  Object.entries(propsDefinition).forEach(([key, definition]) => {
    if (definition.required && props[key] === undefined) {
      errors.push(`Prop '${key}' é obrigatória`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gera código JSX a partir das props
 */
export function generateCode(
  componentName: string,
  props: Record<string, any>
): string {
  const propsString = Object.entries(props)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else if (typeof value === 'boolean') {
        return value ? key : `${key}={false}`;
      } else if (typeof value === 'function') {
        return `${key}={() => {}}`;
      } else {
        return `${key}={${JSON.stringify(value)}}`;
      }
    })
    .join('\n  ');

  return `<${componentName}\n  ${propsString}\n/>`;
}
