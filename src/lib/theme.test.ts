import { describe, expect, it } from 'vitest';
import { contrastChannels, hexToRgbChannels } from './theme';

describe('cores do tema', () => {
  it('converte hexadecimal em canais RGB, com ou sem #', () => {
    expect(hexToRgbChannels('#378F9A')).toBe('55 143 154');
    expect(hexToRgbChannels('378f9a')).toBe('55 143 154');
    expect(hexToRgbChannels('  #000000 ')).toBe('0 0 0');
  });

  it('recusa cor inválida', () => {
    expect(hexToRgbChannels('#fff')).toBeNull();
    expect(hexToRgbChannels('vermelho')).toBeNull();
    expect(hexToRgbChannels('')).toBeNull();
  });

  it('texto escuro sobre cor clara e branco sobre cor escura', () => {
    expect(contrastChannels('#FFE600')).toBe('10 14 20');
    expect(contrastChannels('#00D23B')).toBe('10 14 20');
    expect(contrastChannels('#1D4ED8')).toBe('255 255 255');
    expect(contrastChannels('#378F9A')).toBe('255 255 255');
    expect(contrastChannels('inválida')).toBe('255 255 255');
  });
});
