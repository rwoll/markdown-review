---
name: markdown-plan-review-feedback
description: Generate markdown (*.md) with inline questions for the user to answer. Use when designing plans, clarifying specs, or gathering structured feedback on proposals.
---

# Plan Review Skill

Generate or edit a `*.md` file that the user will review in an interactive Plan Review UI. The UI renders your markdown and lets the user answer embedded questions, leave inline annotations on any block, and add general comments.

## Asking Questions

Embed questions using fenced code blocks with a `question:` language prefix. Each question block must include an `id` (unique within the document) and a `question` field.

### Open-ended question

```question:open
id: q-approach
question: What concerns do you have about this approach?
```

### Single-choice question

```question:choice
id: q-database
question: Which database should we use?
options: PostgreSQL|MySQL|SQLite
```

### Multi-select (checkbox) question

```question:checkbox
id: q-features
question: Which features should be included in the MVP?
options: Authentication|Search|Notifications|Analytics|Export
```

## Question Syntax Rules

- `id` must be unique across the document (use kebab-case, e.g. `q-auth-strategy`)
- `question` is the prompt shown to the user
- `options` is required for `choice` and `checkbox` types; separate options with `|`
- The question block will be rendered as an interactive widget, not as a code block
- Place questions where they are most relevant in the document — right after the section they relate to

## Structuring the Document

Write the markdown like a normal plan or spec. Use headings, lists, code blocks, and blockquotes as usual. The user can click on **any block** to leave an inline annotation, so structure your content into clear, annotatable blocks.

Good structure:
- Start with a title (`# heading`) and brief summary
- Use `##` and `###` sections to organize topics
- Place questions immediately after the relevant section
- Use code blocks with language tags for technical examples
- End with a summary or next-steps section

## Feedback Format

When the user returns feedback, it will contain:

- **Question answers**: Responses to all embedded `question:*` blocks (open text, selected choice, or checked options)
- **Inline annotations**: Comments anchored to specific blocks (headings, paragraphs, code blocks, list items)
- **General notes**: Unanchored comments about the document as a whole

Use this feedback to refine the plan, resolve open questions, and proceed with implementation.

## When to Use

- After generating a plan or design document that needs human review
- When you want structured input on a proposal (e.g. "which approach?", "what's in scope?")
- To gather requirements or preferences before starting implementation
- Any time the user should review, annotate, and respond to a markdown document
- When multiple valid approaches exist and you need the user to decide

## Tips

- Ask focused questions — one decision per question
- Provide clear, distinct options for choice/checkbox questions
- Don't overload the document with too many questions; 3–7 is ideal
- Use open-ended questions sparingly — prefer choice/checkbox when options are known
- Include enough context before each question so the user can answer without external reference
