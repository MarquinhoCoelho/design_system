import { describe, expect, it } from 'vitest';
import { filterOptions, fold } from './selectSearch';

const options = [
  { label: 'Inglês para viagens', description: 'Publicado' },
  { label: 'Violão para iniciantes', description: 'Rascunho' },
  { label: 'Finanças pessoais' },
];

describe('busca das listas de escolha', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(fold('INGLÊS Violão')).toBe('ingles violao');
    expect(filterOptions(options, 'ingles').map((o) => o.label)).toEqual(['Inglês para viagens']);
    expect(filterOptions(options, 'VIOLAO').map((o) => o.label)).toEqual(['Violão para iniciantes']);
  });

  it('procura também na descrição', () => {
    expect(filterOptions(options, 'rascunho').map((o) => o.label)).toEqual(['Violão para iniciantes']);
  });

  it('busca vazia ou só com espaços devolve todas as opções', () => {
    expect(filterOptions(options, '')).toBe(options);
    expect(filterOptions(options, '   ')).toBe(options);
  });

  it('sem resultado devolve lista vazia', () => {
    expect(filterOptions(options, 'culinária')).toEqual([]);
  });

  it('acha pelo meio do nome', () => {
    expect(filterOptions(options, 'para').length).toBe(2);
  });
});
