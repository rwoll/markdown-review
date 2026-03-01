# Plan Review UI

[![CI](https://github.com/rwoll/markdown-review/actions/workflows/ci.yml/badge.svg)](https://github.com/rwoll/markdown-review/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/markdown-review)](https://www.npmjs.com/package/markdown-review)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/rwoll.markdown-review)](https://marketplace.visualstudio.com/items?itemName=rwoll.markdown-review)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Interactive plan review UI for markdown files — annotate sections,
> answer AI-agent embedded questions, and export structured feedback.

Plan Review is a single review UI deployed across three surfaces — all sharing a core bundle built with **Preact** and **TypeScript**.

| Surface | Description |
|---------|-------------|
| [**VS Code Extension**](#vs-code-extension) | Webview panel; feedback is forwarded to Copilot chat |
| [**Copilot CLI Plugin**](#copilot-cli-plugin) | Review skill for GitHub Copilot in the terminal |
| [**CLI (`markdown-review`)**](#quick-start) | `npx markdown-review PLAN.md` — opens a local browser UI |

## VS Code Extension

Install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=rwoll.markdown-review) to review markdown plans directly inside VS Code.

```
ext install rwoll.markdown-review
```

Once installed, right-click any `.md` file in Explorer and select **Open With… → Plan Review**, or run the **Plan Review: Open** command from the Command Palette.

Feedback is forwarded to Copilot chat so your AI agent can incorporate it immediately.

> **Tip:** To set Plan Review as the default editor for markdown files, see [Choose Which Editor Opens Markdown](#vs-code-choose-which-editor-opens-markdown).

## Copilot CLI Plugin

The `packages/copilot-plugin` package is a [plugin for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) that adds a **review** skill. When invoked, Copilot writes a plan to disk, opens it in a browser-based review UI, and waits for your feedback — all without leaving the terminal.

### Install

```bash
copilot plugin install rwoll/markdown-review:packages/copilot-plugin
```

Or from within an interactive Copilot CLI session:

```
/plugin install rwoll/markdown-review:packages/copilot-plugin
```

The `:packages/copilot-plugin` path suffix is required because `plugin.json` is not at the repository root ([docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing#install-directly-from-an-online-git-repository)).

### Manage

```bash
copilot plugin list                        # view installed plugins
copilot plugin update markdown-review      # update to latest version
copilot plugin uninstall markdown-review   # remove the plugin
```

### How It Works

1. Copilot writes a markdown plan file (e.g. `plan.md`).
2. It runs `npx -y markdown-review@latest plan.md`, which starts a local server and opens your browser.
3. You review, annotate, and answer embedded questions in the browser UI.
4. You click **Submit** — feedback is sent back to Copilot and the server exits.
5. Copilot incorporates your feedback and continues.

## Quick Start

```bash
npx markdown-review PLAN.md            # review in browser, feedback to stdout
npx markdown-review PLAN.md -o fb.md   # write feedback to file
npx markdown-review PLAN.md --json     # JSON output instead of markdown
```

## Monorepo Layout

| Package | Purpose | Output |
|---------|---------|--------|
| `packages/core` | Shared UI (Preact IIFE) | `dist/plan-review-core.iife.js` |
| `packages/web` | Static web app | `dist/` (HTML + JS) |
| `packages/markdown-review` | npm CLI | `bin/markdown-review.js` |
| `packages/vscode` | VS Code extension | `dist/extension.js` |
| `packages/copilot-plugin` | Copilot CLI plugin | `plugin.json` + SKILL.md |

## Features

- **Document rendering** — h1–h3, paragraphs, lists, blockquotes, syntax-highlighted code
- **Embedded AI questions** — open-text, single-choice, multi-checkbox with "Other" option
- **Inline annotations** — click any block to leave a comment
- **General feedback** — start typing anywhere to open the comment sheet
- **Export** — download `PLAN-feedback.md` with responses, annotations, and notes
- **Responsive** — mobile (< 800 px), tablet (800–1099 px), desktop (≥ 1100 px)
- **Dark theme** — high-contrast, reading-optimised

## Embedding Questions

Question blocks are authored in markdown by AI tools (for example Copilot or other agent workflows), and reviewers answer them directly in the UI.

Use fenced code blocks with a `question:` language tag:

````markdown
```question:open
id: q-approach
question: What do you think about this approach?
```

```question:choice
id: q-preference
question: Which option do you prefer?
options: Option A | Option B | Option C
```

```question:checkbox
id: q-features
question: Select all that apply
options: Feature 1 | Feature 2 | Feature 3
```
````

## VS Code: Choose Which Editor Opens Markdown

If you want to switch between the default Markdown editor, preview, or this review UI for markdown files:

1. In Explorer, right-click a `.md` file.
2. Select **Open With...**.
3. Pick the editor/view you want.
4. Optional: choose **Set as Default** for that file type.

For workspace-level mapping, open VS Code settings JSON and add or adjust `workbench.editorAssociations` entries for markdown paths/patterns.

## Development

```bash
npm install          # install all workspace dependencies
npm run build        # build core → web, markdown-review, vscode
npm test             # run Playwright tests
npm run dev          # watch mode for core + web
```

### Build order

The root `build` script runs packages in dependency order:

1. `packages/core` (IIFE bundle — everything else depends on this)
2. `packages/web`, `packages/markdown-review`, `packages/vscode` (consume the core bundle)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing, and PR guidelines.

## License

[MIT](LICENSE)
