/** Texto sem acentos e em minúsculas, para comparar buscas ("ingles" acha "Inglês"). */
export const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Opções cujo nome ou descrição contém o que foi digitado. Busca vazia devolve todas. */
export function filterOptions<T extends { label: string; description?: string }>(options: T[], query: string): T[] {
  const q = fold(query.trim());
  return q ? options.filter((o) => fold(`${o.label} ${o.description ?? ''}`).includes(q)) : options;
}
