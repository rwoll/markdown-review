<p align="center">
  <img src="images/logo.png" width="160" height="160" alt="Plan Review logo">
</p>

<h1 align="center">Plan Review</h1>

<p align="center">
  <strong>Stop reviewing AI plans in chat. Review them like documents.</strong>
</p>

<p align="center">
  <a href="vscode:extension/rwoll.markdown-review"><img src="https://img.shields.io/badge/VS%20Code-Install-0078d4?logo=visualstudiocode&logoColor=white" alt="Install in VS Code"></a>
  <a href="vscode-insiders:extension/rwoll.markdown-review"><img src="https://img.shields.io/badge/VS%20Code%20Insiders-Install-24bfa5?logo=visualstudiocode&logoColor=white" alt="Install in VS Code Insiders"></a>
</p>

---

## Why Plan Review?

AI coding agents are great at implementation — but most of your time is spent aligning on *what* to build. You're reviewing `PLAN.md`, `SPEC.md`, or `ARCHITECTURE.md` files, resolving open questions, and refining scope — all buried in a chat thread.

**Plan Review turns that workflow inside out.** Instead of scrolling through chat, you review plans as interactive documents — right inside VS Code:

- 🔍 **Read plans as documents, not chat messages** — clean, readable layout with a live outline and notes panel.
- ❓ **Answer AI-embedded questions in context** — agents can drop `question:open`, `question:choice`, and `question:checkbox` blocks directly into the plan.
- ✏️ **Annotate any section with one click** — leave comments on paragraphs, headings, code blocks, or list items.
- 🚀 **Send structured feedback to Copilot in one click** — your answers and annotations flow back to the agent automatically, ready for it to act on.

---

## Screenshots

### Main Review Surface

Open any `.md` file with Plan Review to see a clean, readable document with a live outline and a notes panel on the right.

![Main review surface](images/main-review-desktop.png)

### Embedded AI Questions

AI-authored question blocks are rendered inline. Reviewers answer them without leaving the document.

![Questions unanswered](images/questions-unanswered.png)

### Answering a Question

Type a response, hit **Submit**, and the question collapses into an answered state in the notes panel.

![Question answered](images/question-answered.png)

### Inline Annotations

Click any paragraph, heading, list item, or code block to open the annotation sheet and leave a comment.

![Inline annotation sheet open](images/inline-annotation.png)

### Annotation Markers

After submitting a comment, a dot marker appears on the block and the note appears in the right-hand panel.

![Annotation dot visible](images/annotation-dot.png)

---

## Features

- **Interactive document rendering** — headings, paragraphs, lists, blockquotes, and syntax-highlighted code blocks, all clickable.
- **Embedded AI questions** — `question:open`, `question:choice`, and `question:checkbox` blocks rendered inline; answers tracked in state.
- **Inline annotations** — click any block to leave a comment; markers appear at the source block.
- **General feedback** — a persistent input at the bottom for overall plan comments.
- **One-click feedback to Copilot** — when you close the review panel or click Export, the full structured feedback is sent to Copilot chat automatically.
- **Dark theme** — high-contrast, reading-optimised layout that matches VS Code's default dark theme.
- **Responsive layout** — works from narrow split-editor panes to full-screen webview panels.

---

## Getting Started

1. Install the extension from the VS Code Marketplace.
2. Open any `.md` file — Plan Review opens automatically as the default editor for Markdown files.
3. Read the plan, answer any embedded questions, and click sections to annotate.
4. Close the panel (or press the **Export** button) — structured feedback is sent to Copilot chat.

> **Tip:** To switch between the standard Markdown preview and Plan Review for a file, right-click the file in Explorer → **Open With…** and choose your preferred editor.

---

## Copilot Agent Skill

The extension ships with a built-in **Agent Skill** (`markdown-plan-review-feedback`) that Copilot and other AI agents can automatically discover and use. When the skill is active, the agent knows:

- The full Plan Review workflow — generate a structured `.md` file, the user reviews it, feedback flows back to the agent.
- The `question:open`, `question:choice`, and `question:checkbox` block syntax for embedding interactive questions.
- Best practices for structuring a reviewable document (headings, question placement, annotatable blocks).

This means you can simply ask Copilot to *"draft a plan for X"* and it will produce a question-rich Markdown file ready to open in Plan Review — no manual prompt engineering required.

---

## Embedding Questions in a Plan

Questions are authored by AI agents as fenced code blocks with a `question:` language tag. Reviewers answer them directly in the review UI.

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

---

## Choosing Which Editor Opens Markdown

Plan Review registers as the **default** custom editor for `.md` files. To switch back to the built-in Markdown preview or text editor for a specific file:

1. Right-click the file in Explorer → **Open With…**
2. Select the editor you want.
3. Optionally choose **Set as Default** to persist that preference for all `.md` files in the workspace.

---

## License

[MIT](https://github.com/rwoll/markdown-review/blob/main/LICENSE)
