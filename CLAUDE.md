# CLAUDE.md — AI Assistant Guide for `sindresorhus/awesome`

This file describes the repository structure, conventions, and workflows for AI assistants working in this codebase.

---

## Repository Overview

This is **[sindresorhus/awesome](https://github.com/sindresorhus/awesome)** — the canonical meta-list of awesome lists. Its primary purpose is to curate high-quality "awesome-*" lists across every topic. It contains no application code beyond the `pixelhq/` subdirectory (described separately below).

---

## Repository Structure

```
awesome/
├── readme.md               # The main curated list (primary content file)
├── awesome.md              # The Awesome manifesto — curation standards
├── contributing.md         # Contribution instructions for external contributors
├── create-list.md          # Guide for creating a new awesome list
├── pull_request_template.md # Detailed PR requirements checklist
├── code-of-conduct.md      # Contributor Covenant code of conduct
├── license                 # CC0 1.0 Universal license
├── .editorconfig           # Editor formatting rules (tabs, LF, UTF-8)
├── .gitattributes          # Git line-ending normalization
├── media/                  # Logos, badges, and design assets
│   ├── logo.svg / logo.png / logo.ai
│   ├── badge.svg / badge-flat.svg / badge-flat2.svg
│   ├── mentioned-badge.svg / mentioned-badge-flat.svg / mentioned-badge-flat2.svg
│   └── readme.md           # Badge usage instructions
├── .github/
│   └── workflows/
│       ├── main.yml        # CI: runs awesome-lint on PRs to `main`
│       └── repo_linter.sh  # Shell script that clones + lints the submitted list
└── pixelhq/                # PixelHQ ULTRA — multi-agent office simulation (see below)
    ├── bridge.js           # WebSocket server / JSONL log tailer (Node.js, CommonJS)
    ├── engine.js           # Core engine: EventBus, A2AProtocol, PersonalityEngine, TerminalBridge (ES modules)
    ├── officeData.js       # Office map / agent configuration data
    └── package.json        # Node ≥18, React 18, Vite 5, ws 8
```

---

## Primary Content: `readme.md`

The `readme.md` is the main deliverable of this repo. It is a manually curated, categorized Markdown list of awesome lists.

### Entry format

Every entry must follow this exact format:

```md
- [List Name](https://github.com/user/awesome-list#readme) - Short description of the topic, not the list.
```

Rules:
- Title is title-cased.
- URL ends with `#readme`.
- Description starts with an uppercase letter and ends with a period.
- Description describes the **topic/subject**, not the list itself.
- Entry is placed at the **bottom** of the appropriate category.
- No blockchain-related lists.
- No CI badges in the description or entry.

### Adding a new entry

1. Find the correct category in `readme.md`.
2. Append the new entry at the bottom of that category section.
3. Confirm the linked list meets all requirements (see `pull_request_template.md`).

---

## CI / Linting

- **Trigger:** Any PR that modifies `readme.md` targeting `main`.
- **What it does:** `.github/workflows/repo_linter.sh` parses the diff, finds newly added `https://...#readme` URLs, clones each repository, and runs `npx awesome-lint` against it.
- **No badge:** The CI badge must not appear in `readme.md`.

To validate a list locally before submitting:
```sh
npx awesome-lint
```

---

## Formatting Conventions (`.editorconfig`)

| Setting | Value |
|---|---|
| Indent style | `tab` |
| Line endings | `LF` |
| Charset | `UTF-8` |
| Trailing whitespace | trimmed |
| Final newline | required |

All files must follow these rules. Do not use spaces for indentation; do not use CRLF line endings.

---

## Branching & Git Conventions

- The canonical default branch is `main` (not `master`).
- The local `master` branch is a legacy artifact; all PRs target `main`.
- PR titles must use the format `Add Name of List` — no "Awesome" prefix, no gerunds, no lowercase.
- Commit messages should be concise and describe what list was added or what meta change was made.

---

## PR Requirements Summary (from `pull_request_template.md`)

Before opening or approving a PR, verify:

- [ ] PR title follows `Add Name of List` format.
- [ ] Entry description: objective, uppercase start, period end, no list name, no tagline.
- [ ] Entry placed at the bottom of its category.
- [ ] URL ends with `#readme` and title is title-cased.
- [ ] The submitted list has existed for ≥ 30 days.
- [ ] The submitted list passes `awesome-lint`.
- [ ] The submitted list uses `main` as its default branch.
- [ ] The submitted list has a CC0 or Creative Commons license (not MIT/BSD/GPL).
- [ ] The submitted list has a `contributing.md`, table of contents, Awesome badge, and project logo.
- [ ] The submitted list has no CI badge in its readme.
- [ ] Reviewer has reviewed at least 2 other open PRs (community requirement).

---

## PixelHQ ULTRA (`pixelhq/`)

A self-contained Node.js + React visualization that turns real AI CLI activity into a pixel-art office game. It is **not** part of the awesome list curation workflow; it is a standalone tool bundled in this repo.

### Architecture

```
pixelhq/
├── bridge.js      # Server: tails JSONL session logs, broadcasts game events over WebSocket
├── engine.js      # Client-side modules (ES modules, used by the React frontend)
│   ├── EventBus          — pub/sub backbone
│   ├── A2AProtocol       — Agent-to-Agent messaging (Google A2A semantics)
│   ├── PersonalityEngine — Maps CLI tool names → character dialogue by role
│   └── TerminalBridge    — WebSocket client; falls back to mock/demo events
└── officeData.js  # Office layout, agent definitions, tile map
```

### How it works

1. **`bridge.js`** (Node.js, CommonJS) runs as a server:
   - Watches `~/.claude/projects`, `~/.codex/sessions`, `~/.gemini/sessions`, `~/.opencode/sessions` for `.jsonl` files.
   - Tails new/existing JSONL files, parses Claude Code / Codex / Gemini CLI session events.
   - Strips PII (keeps only structural metadata: tool name, agent depth, file basename).
   - Infers agent **role** from nesting depth: `boss → supervisor → employee → intern`.
   - Broadcasts sanitized game events over WebSocket on `ws://localhost:7890`.

2. **`engine.js`** (ES modules) runs in the browser:
   - `TerminalBridge` connects to the WebSocket server.
   - Falls back to built-in demo events if no server is running (`mockMode`).
   - `PersonalityEngine` translates raw CLI events to role-appropriate character speech.
   - `A2AProtocol` manages meetings, debates, work handoffs, and task assignments between agent characters.

3. The React frontend (entry: `bridge.js` per `package.json`, built with Vite) renders the pixel office.

### Running PixelHQ ULTRA

```sh
cd pixelhq
npm install

# Start the bridge server (watches your local AI CLI sessions)
npm run bridge
# or with custom port:
npm run bridge:dev   # --port 7890

# Start the frontend (Vite dev server)
npm run dev

# Production build
npm run build
```

**Requirements:** Node.js ≥ 18.

### Key data flow

```
AI CLI session JSONL log
        ↓
  bridge.js (Node server)
     tails & parses
        ↓
  WebSocket broadcast
        ↓
  TerminalBridge (browser)
        ↓
  PersonalityEngine.translate()
        ↓
  EventBus.emit(game:agent_speak / game:agent_work / game:agent_move)
        ↓
  React pixel-office render
```

### Tool → game event mapping

| CLI Tool | Game Event Type | Office Destination |
|---|---|---|
| `Bash`, `WebFetch`, `WebSearch` | `tool_bash` | `terminal` tile |
| `Read`, `Glob`, `Grep` | `tool_read` | `filing` tile |
| `Write`, `Edit`, `NotebookEdit` | `tool_write` / `tool_edit` | `desk` tile |
| `Task`, `TodoWrite` | `tool_task` | `center` tile |
| Thinking blocks | `thinking` | `desk` tile |

### A2A Protocol message types

| Constant | Meaning |
|---|---|
| `TASK_ASSIGN` | Boss → Worker: here's your task |
| `TASK_COMPLETE` | Worker → Boss: done |
| `TASK_BLOCKED` | Worker → Supervisor: I'm stuck |
| `PEER_REVIEW` | Employee → Employee: review my artifact |
| `KNOWLEDGE_SHARE` | Anyone → All: broadcast an insight |
| `MEETING_CALL` | Boss → Group: convene |
| `DEBATE_OPEN/CLOSE` | Two agents: structured disagreement |
| `WORK_HANDOFF` | Pass artifact between agents |
| `STATUS_PING` | Heartbeat |
| `EVOLUTION_VOTE` | Agents vote on protocol changes |

---

## What AI Assistants Should and Should Not Do

### For the awesome list (`readme.md`)

- **Do** add entries strictly following the format rules above.
- **Do** place entries at the bottom of the relevant category.
- **Do not** reformat existing entries, reorder categories, or change descriptions of existing items unless explicitly asked.
- **Do not** add lists that are <30 days old, blockchain-related, or lack a CC0/CC license.
- **Do not** add CI badges to entries.

### For PixelHQ ULTRA (`pixelhq/`)

- `bridge.js` uses CommonJS (`require`/`module.exports`). Do not convert to ES modules.
- `engine.js` uses ES module syntax (`export class`, `export const`). Keep it as ES modules.
- Privacy is a hard requirement in `bridge.js`: the `strip()` function must never emit actual file content or command arguments, only structural metadata.
- When modifying `PersonalityEngine` speech templates, maintain the four-role structure: `boss`, `supervisor`, `employee`, `intern`.
- The `A2AProtocol` implements a subset of Google's A2A spec semantics; preserve the message type constants in `A2A_MSG`.

### General

- Follow `.editorconfig`: tabs for indentation, LF line endings, UTF-8.
- Do not push to `main` or `master` directly. All changes go through PRs targeting `main`.
- Do not add documentation files unless explicitly requested.
