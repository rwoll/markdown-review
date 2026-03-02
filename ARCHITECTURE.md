# Architecture

Plan Review is a monorepo that ships a single review UI across three surfaces — all sharing a core bundle built with **Preact** and **TypeScript**.

## Package Layout

| Package | Purpose | Output |
|---------|---------|--------|
| `packages/core` | Shared UI (Preact IIFE) | `dist/plan-review-core.iife.js` |
| `packages/web` | Static web app | `dist/` (HTML + JS) |
| `packages/markdown-review` | npm CLI | `bin/markdown-review.js` |
| `packages/vscode` | VS Code extension | `dist/extension.js` |
| `packages/copilot-plugin` | Copilot CLI plugin | `plugin.json` + SKILL.md |

## Build Order

The root `build` script runs packages in dependency order:

1. `packages/core` (IIFE bundle — everything else depends on this)
2. `packages/web`, `packages/markdown-review`, `packages/vscode` (consume the core bundle)

## Development

```bash
npm install          # install all workspace dependencies
npm run build        # build core → web, markdown-review, vscode
npm test             # run Playwright tests
npm run dev          # watch mode for core + web
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for testing, commit conventions, and PR guidelines.
