export type Theme = 'light' | 'dark';
const THEME_KEY = 'ds-theme';

/** Converte "#378F9A" em "55 143 154" (formato usado pelas variáveis CSS). */
export function hexToRgbChannels(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Cor do texto sobre a cor da marca: escuro em cores claras, branco em cores escuras. */
export function contrastChannels(hex: string): string {
  const ch = hexToRgbChannels(hex);
  if (!ch) return '255 255 255';
  const [r, g, b] = ch.split(' ').map((v) => Number(v) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? '10 14 20' : '255 255 255';
}

/** Troca a cor da marca do projeto inteiro (botões, foco, seleções). Cor inválida é ignorada. */
export function setBrandColor(hex: string, root: HTMLElement = document.documentElement): boolean {
  const ch = hexToRgbChannels(hex);
  if (!ch) return false;
  root.style.setProperty('--primary', ch);
  root.style.setProperty('--primary-fg', contrastChannels(hex));
  return true;
}

/** Tema salvo; sem escolha salva, segue o sistema da pessoa. */
export function getTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* navegação privada */
  }
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Aplica e guarda o tema. Chame uma vez ao abrir o app: `setTheme(getTheme())`. */
export function setTheme(theme: Theme, root: HTMLElement = document.documentElement) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* navegação privada */
  }
}
