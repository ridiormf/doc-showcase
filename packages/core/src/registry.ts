import type { ComponentDocConfig } from './types';

/**
 * Registro global de componentes documentados
 */
class ComponentRegistry {
  private components: Map<string, ComponentDocConfig> = new Map();
  private categories: Map<string, ComponentDocConfig[]> = new Map();

  /**
   * Registra um novo componente
   */
  register(config: ComponentDocConfig): void {
    const id = config.id || this.generateId(config.title);
    const componentConfig = { ...config, id };

    this.components.set(id, componentConfig);

    // Adiciona à categoria
    const category = config.category || 'Other';
    if (!this.categories.has(category)) {
      this.categories.set(category, []);
    }
    this.categories.get(category)!.push(componentConfig);
  }

  /**
   * Busca um componente pelo ID
   */
  get(id: string): ComponentDocConfig | undefined {
    return this.components.get(id);
  }

  /**
   * Lista todos os componentes
   */
  getAll(): ComponentDocConfig[] {
    return Array.from(this.components.values());
  }

  /**
   * Lista componentes por categoria
   */
  getByCategory(category: string): ComponentDocConfig[] {
    return this.categories.get(category) || [];
  }

  /**
   * Lista todas as categorias
   */
  getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  /**
   * Busca componentes por query
   */
  search(query: string): ComponentDocConfig[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((config) => {
      return (
        config.title.toLowerCase().includes(lowerQuery) ||
        config.description.toLowerCase().includes(lowerQuery) ||
        config.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Limpa o registro
   */
  clear(): void {
    this.components.clear();
    this.categories.clear();
  }

  /**
   * Gera um ID único baseado no título
   */
  private generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}

export const componentRegistry = new ComponentRegistry();
