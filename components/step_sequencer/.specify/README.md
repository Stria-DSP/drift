# Spec Kit layout (step sequencer)

This directory follows [GitHub Spec Kit](https://github.com/github/spec-kit) layout so we can use spec-driven development.

## What’s here

- **memory/constitution.md** — Project principles and governance for the step sequencer.
- **memory/specs/001-step-sequencer-jsui/spec.md** — Feature spec in Spec Kit format; aligns with **SPEC.md** at repo root (SPEC.md remains the single source of truth for protocol and behavior).

## Full Spec Kit (optional)

To get the full Spec Kit CLI and Cursor slash commands (`/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`):

1. Install the Specify CLI (requires [uv](https://docs.astral.sh/uv/)):
   ```bash
   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
   ```
2. From this directory (`step_sequencer`), run:
   ```bash
   specify init . --ai cursor-agent
   ```
   This merges Spec Kit templates and command files into the project. If you already have `.specify/memory/` content, use `--force` to overwrite or merge as needed.

Without the CLI, you can still follow the workflow: treat **SPEC.md** and **.specify/memory/constitution.md** as the source of truth; implement and refactor against them; run **npm run check** after build.

---

## What now (after `specify init . --ai cursor-agent`)

1. **Use the slash commands**  
   In Cursor, type `/` in the chat box. You should see Spec Kit commands:
   - **speckit.constitution** — Create or update `.specify/memory/constitution.md` from principles.
   - **speckit.specify** — Build or update a feature specification.
   - **speckit.plan** — Generate an implementation plan (runs scripts, creates `plan.md`, `research.md`, etc.).
   - **speckit.tasks** — Break the plan into tasks (`tasks.md`).
   - **speckit.implement** — Execute the task list (requires `tasks.md` and optional checklists).
   - **speckit.analyze** — Cross-artifact consistency and coverage.
   - **speckit.checklist** — Custom quality checklists.
   - **speckit.clarify** / **speckit.taskstoissues** — Clarification and issue tracking.

2. **Where commands run**  
   The slash commands and scripts expect to run from the **step_sequencer** directory (the one that contains `.specify/`). If your Cursor workspace is the whole **stria** repo, open `components/step_sequencer` in the file tree and use chat with that folder in context so the agent runs from the right place. Alternatively, open just the `step_sequencer` folder in Cursor when doing spec-driven work so the commands are in scope.

3. **Suggested next steps**
   - Run **speckit.constitution** (with or without extra instructions) to refresh the constitution from the template and remove any remaining placeholders.
   - Run **speckit.analyze** to see how specs, constitution, and code align.
   - For a new feature: run **speckit.plan** with a short description, then **speckit.tasks**, then **speckit.implement** when ready.
   - After any code changes, keep running `npm run check` in step_sequencer to validate the built script against the spec.
