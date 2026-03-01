---
name: review
description: Open an interactive plan review UI in the browser to collect structured feedback on a markdown file.
---

# Plan Review Skill

Opens a markdown file in an interactive review UI in the user's browser.
The user can annotate sections, answer embedded questions, and leave general feedback.
When the user submits, structured feedback is returned to the conversation.

## Usage

This skill is invoked by the LLM when it decides the user should review a
markdown document. There is no dedicated slash command — the agent runs the
`markdown-review` CLI tool directly via the shell.

## Important: CLI Has No Native UI

Unlike VS Code, the Copilot CLI has no built-in webview or GUI surface. This
skill bridges that gap by spawning a **temporary local web server** and opening
the user's **default browser**. The browser tab *is* the review UI.

You (the LLM) must understand the end-to-end flow so you can explain what is
happening and correctly handle the feedback that comes back.

## End-to-End Flow

1. **You write a markdown file** (e.g. `plan.md`) to disk using the normal
   file-creation tools.
2. **You run `npx -y markdown-review@latest <filepath>`** via the shell tool.
   This is a *blocking* command — it will not return until the user submits
   feedback or the 30-minute timeout expires.
3. The CLI tool reads the markdown file.
4. It starts a temporary HTTP server on a random port.
5. It **automatically opens the review UI in the user's default browser**.
6. It serves the Preact-based review UI with the markdown content inlined.
7. **The user reviews in the browser.** They can:
   - Read the rendered markdown.
   - Answer embedded `question:*` blocks (open-text, single-choice, checkbox).
   - Leave inline annotations on any paragraph or heading.
   - Write general feedback in the comment sheet.
8. **The user clicks "Submit".** The browser POSTs the feedback JSON to the
   local server.
9. **The server writes feedback to stdout and exits.** The browser shows a
   "Feedback sent ✓ — you can close this tab" confirmation page.
10. **You capture the stdout output** — this is the structured feedback in
    markdown format (or JSON if `--json` was passed).
11. **You incorporate the feedback** into your next response and continue the
    conversation.

## Implementation

Run the `markdown-review` CLI tool and capture its stdout:

```
npx -y markdown-review@latest <filepath>
```

### Flags

| Flag | Description |
|------|-------------|
| `-o <file>` | Write feedback to a file instead of stdout |
| `--json` | Output feedback as JSON instead of markdown |
| `--port <N>` | Use a specific port (default: random) |
| `--no-open` | Don't auto-open the browser |

### Execution Notes

- Use `mode: "sync"` with a generous `initial_wait` (e.g. 600 seconds) since
  the command blocks until the user submits feedback in the browser.
- **stdout** contains the feedback. **stderr** contains status messages (e.g.
  "serving on http://localhost:PORT").
- The process exits with code 0 on successful submission, code 1 on timeout.
- The command auto-opens the browser — tell the user to look for the new tab.

## Embedding Questions in Your Plan

When writing a plan for review, you can embed structured questions that render
as interactive form elements in the review UI. Use fenced code blocks with a
`question:` language tag:

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

## Feedback Format

The returned feedback includes:
- Answers to all embedded `question:*` blocks
- Inline annotations anchored to specific sections
- General notes and comments

## What to Tell the User

When you invoke this skill, tell the user something like:

> "I've opened a review UI in your browser. Please review the plan, answer any
> questions, and leave annotations or comments. Click **Submit** when you're
> done — your feedback will come back here and I'll incorporate it."

After receiving feedback, summarize what the user said and ask if they'd like
you to proceed with the plan (incorporating their feedback) or make changes
first.

## When to Use

- After generating a plan that needs human approval
- When you want structured feedback on a proposal
- Any time the user should review and annotate a markdown document
- The user explicitly asks to review a markdown document
