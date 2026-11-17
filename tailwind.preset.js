/** Preset do design system: use em `presets: [require('./tailwind.preset.js')]` (ou import) no tailwind.config do projeto. */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          fg: 'rgb(var(--primary-fg) / <alpha-value>)',
        },
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        field: 'rgb(var(--field) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
      boxShadow: {
        xs: '0 1px 2px rgb(var(--shadow) / 0.05)',
        card: '0 1px 2px rgb(var(--shadow) / 0.04), 0 2px 8px -2px rgb(var(--shadow) / 0.06)',
        pop: '0 4px 8px -2px rgb(var(--shadow) / 0.08), 0 18px 44px -10px rgb(var(--shadow) / 0.28)',
      },
    },
  },
};
