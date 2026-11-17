# Design system

Componentes padrão para os projetos (React + Tailwind), com tema claro e escuro e cor da marca trocável.

## Ver funcionando

```bash
npm install
npm run dev
```

Abre a demonstração com todos os componentes, o botão de tema e o seletor de cor da marca.

## O que tem

| Precisa de | Use |
|---|---|
| Botão | `Button` (primary, secondary, soft, ghost, danger; tamanhos sm, md, lg; ícones; carregando) |
| Botão só com ícone | `IconButton` (sempre com dica) |
| Campo de texto | `Field` / `Input` (ícone, prefixo, sufixo, dica, erro, senha com mostrar/esconder) |
| Texto longo | `TextArea` (com contador) |
| Lista de uma escolha | `Select` (teclado, busca sem acento, ícones, descrições) |
| Lista de várias escolhas | `MultiSelect` (etiquetas, selecionar todos, limpar) |
| Marcar e alternar | `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Segmented` |
| Estado e aviso | `Badge`, `Alert`, `Avatar`, `Skeleton`, `EmptyState`, `Spinner` |
| Estrutura | `Card`, `Tabs`, `Modal` |
| Dica | `Tooltip`, `InfoTip` |
| Confirmação | `await ask({ title, message, confirm, danger })` com `<ConfirmHost />` na raiz |

## Usar em outro projeto

1. Instale as dependências: `npm i @floating-ui/react lucide-react sonner` (além de React e Tailwind 3).
2. Copie `src/components`, `src/lib/theme.ts`, `src/styles/design-system.css` e `tailwind.preset.js`.
3. No `tailwind.config.js`: `presets: [preset]` (importando `./tailwind.preset.js`).
4. No CSS principal, depois das diretivas do Tailwind: `@import './styles/design-system.css';`
5. Ao abrir o app: `setTheme(getTheme())` e, se quiser, `setBrandColor('#suacor')`.
6. Ponha `<ConfirmHost />` e o `<Toaster />` do sonner uma vez na raiz.

## Regras

- Só cores por token (`bg-primary`, `text-muted`, `border-border/[0.14]`). Nada de hexadecimal solto.
- Ícones só da biblioteca Lucide. Botão só com ícone usa `IconButton`.
- Não use `<select>`, `alert()`, `confirm()` nem `title` nativo: use `Select`, toast, `ask` e `Tooltip`.
- Todo campo tem rótulo; erro diz o que houve e o que fazer.

## Comandos

`npm run dev` · `npm run build` · `npm test` · `npm run lint`
