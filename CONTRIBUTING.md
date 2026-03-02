# Contributing to Plan Review UI

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/rwoll/markdown-review.git
cd markdown-review
npm install
npm run build
```

### Build Order

The root `build` script runs packages in dependency order:

1. `packages/core` (IIFE bundle — everything else depends on this)
2. `packages/web`, `packages/markdown-review`, `packages/vscode` (consume the core bundle)

### Watch Mode

```bash
npm run dev    # watches core + web
```

## Testing

Tests use [Playwright](https://playwright.dev/) and run against the built output.

```bash
npm run build          # must build first
npm test               # runs all Playwright tests
npx playwright test    # alternative
```

To update snapshots after intentional visual changes:

```bash
npx playwright test --update-snapshots
```

## Submitting a Pull Request

1. **Fork** the repo and create a branch from `main`.
2. Make your changes — keep diffs small and focused.
3. **Build** (`npm run build`) and **test** (`npm test`) locally.
4. Open a pull request with a clear description of the change.

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) style:

- `feat: add new question type`
- `fix: correct annotation positioning`
- `docs: update CLI usage examples`

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full package layout and build order.

## Code Style

- TypeScript throughout
- Preact for UI components
- Keep dependencies minimal

## Questions?

Open an [issue](https://github.com/rwoll/markdown-review/issues) — we're happy to help.
