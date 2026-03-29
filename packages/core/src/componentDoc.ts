import { componentRegistry } from './registry';
import type { ComponentDocConfig } from './types';

/**
 * HOC para criar documentação de componente
 */
export function ComponentDoc<P = any>(config: ComponentDocConfig<P>) {
  // Registra o componente
  componentRegistry.register(config);

  // Retorna a configuração para uso direto
  return config;
}

/**
 * Hook para acessar um componente documentado
 */
export function useComponentDoc(id: string): ComponentDocConfig | undefined {
  return componentRegistry.get(id);
}

/**
 * Hook para listar todos os componentes
 */
export function useAllComponents(): ComponentDocConfig[] {
  return componentRegistry.getAll();
}

/**
 * Hook para listar componentes por categoria
 */
export function useComponentsByCategory(category: string): ComponentDocConfig[] {
  return componentRegistry.getByCategory(category);
}

/**
 * Hook para buscar componentes
 */
export function useComponentSearch(query: string): ComponentDocConfig[] {
  return componentRegistry.search(query);
}

/**
 * Hook para listar categorias
 */
export function useCategories(): string[] {
  return componentRegistry.getCategories();
}
