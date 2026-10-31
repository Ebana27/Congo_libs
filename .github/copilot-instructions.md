# Congolibs agent routing

These workspace rules complement the existing user-level engineering, backend, frontend, security, and testing instructions. Do not copy their detailed procedures here.

## Understand and route each request

- Inspect the relevant source, tests, documentation, and current Git status before changing files. Preserve unrelated worktree changes. The repository contains a Django backend in `Backend/`, a React/Vite web client in `client/`, and an Expo/React Native app at the repository root.
- Classify the request by outcome, scope, risk, and complexity. Handle questions and small, contained changes directly; use a proportionate plan for work spanning components, APIs, schemas, security boundaries, or deployment.
- Establish observable acceptance criteria and the smallest useful verification before implementation. Resolve important architecture or product decisions from repository evidence where possible; ask only when missing information blocks safe progress or requires user approval.
- Discover Skills from their descriptions in the active host and, when relevant, inspect project Skills under `.github/skills/` and `.agents/skills/`. Read and follow a Skill's `SKILL.md` before applying its workflow. Use only relevant Skills, and never claim a Skill was loaded or used unless it was.
- For frontend design, UI redesign, or visual review, automatically consider the available design Skills (for example `frontend-design`, `anti-ui-slop`, or a visual-review Skill). Select by task: do not load a design workflow for an unrelated UI bug, and respect each Skill's own constraints.

## Delegate deliberately

- Prefer the existing specialized agents available to the active VS Code profile; do not recreate their roles or assume user-level agents are installed for every collaborator.
- Delegate only when the active host exposes real agent/subagent invocation and a suitable agent is available. If not, do the work sequentially yourself and disclose that no delegation occurred. A textual mention of an agent is not a handoff.
- Match agents to actual work: architect for consequential design/API/schema decisions; frontend or backend engineer for implementation; UI/UX designer for interaction and visual specifications; QA for substantial test planning; security engineer for sensitive flows; code reviewer for independent review; DevOps engineer for operational changes.
- Give each delegate a bounded task, context, dependencies, expected evidence, and acceptance criteria. Record real dependencies; run work in parallel only when interfaces are clear and files do not overlap. Keep shared-file edits under one owner's coordination.

## Verify and report

- Run the smallest relevant existing tests and checks, expanding them when scope or risk warrants. For visual work, inspect the rendered result when browser and runtime tools are available. Never infer success from code inspection or claim unavailable checks ran.
- Review the resulting diff for scope, regressions, security, and accidental exposure. Report files changed, actual tests and outcomes, real delegation/Skill use, and material limitations.
- Do not perform destructive actions, production changes, or secret changes without explicit authorization.

Repository references: [README.md](../README.md), [API notes](../docs/api-notes.md), and [admin panel conventions](../docs/admin-panel.md).
