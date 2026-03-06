# PixelHQ ULTRA — Architecture

> A complete multi-agent pixel office system that turns real AI-agent CLI sessions into a live, tile-based office game.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Repository Layout](#repository-layout)
3. [Component Reference](#component-reference)
   - [Terminal Bridge Server (`bridge.js`)](#terminal-bridge-server-bridgejs)
   - [Core Engine (`engine.js`)](#core-engine-enginejs)
   - [Office Data & World Map (`officeData.js`)](#office-data--world-map-officedatajs)
   - [UI Component (`PixelHQUltra.jsx`)](#ui-component-pixelhqultrajsx)
4. [Agent Role Hierarchy](#agent-role-hierarchy)
5. [A2A Protocol](#a2a-protocol)
6. [Personality Engine](#personality-engine)
7. [Office Layout](#office-layout)
8. [Data Flow](#data-flow)
9. [Getting Started](#getting-started)

---

## System Overview

PixelHQ ULTRA bridges real AI coding agent sessions (Claude Code, Codex CLI, Gemini CLI, OpenCode) with a retro pixel-art office world rendered in React. It works in two layers:

```
┌─────────────────────────────────────────────────────────────┐
│  AI Agent CLI sessions (Claude Code / Codex / Gemini / …)  │
│  write JSONL logs to   ~/.claude/projects  etc.             │
└───────────────────────┬─────────────────────────────────────┘
                        │  fs.watch (tail JSONL)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  bridge.js  — Node.js Terminal Bridge Server                │
│  • Strips PII / semantic content (privacy gate)             │
│  • Maps tool names → game event types                       │
│  • Infers agent role from session depth                     │
│  • Broadcasts structured events over WebSocket              │
└───────────────────────┬─────────────────────────────────────┘
                        │  ws://localhost:7890
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  PixelHQUltra.jsx  — React UI (runs in the browser)         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │ TerminalBridge│  │ PersonalityEng│  │ A2AProtocol       │ │
│  │ (engine.js)  │  │ (engine.js)  │  │ (engine.js)       │ │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬─────────┘ │
│         │                 │                     │           │
│         └─────────────────┴──────────EventBus───┘           │
│                              (engine.js)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Tile-based office world (officeData.js)            │    │
│  │  60 × 38 tiles  •  26 × 18 viewport  •  32 px/tile  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

When no `bridge.js` server is reachable the UI enters **demo mode**, replaying a canned sequence of events so the office is always alive.

---

## Repository Layout

```
pixelhq/
├── bridge.js          # Node.js WebSocket server — watches JSONL logs
├── engine.js          # EventBus · A2AProtocol · PersonalityEngine · TerminalBridge
├── officeData.js      # Tile constants · world map generator · agent definitions
├── PixelHQUltra.jsx   # React root component — renders the full office UI
└── package.json       # Project metadata & npm scripts
```

---

## Component Reference

### Terminal Bridge Server (`bridge.js`)

**Runtime:** Node.js ≥ 18, no bundler needed.

| Responsibility | Detail |
|---|---|
| **JSONL tail** | `fs.watch` tails any `.jsonl` file that appears under the configured watch directories. Handles new files dynamically. |
| **Privacy gate** | `strip()` keeps only the command verb or bare file name — never the full path, arguments, or file contents. |
| **Event parsing** | `parseLine()` converts a raw JSONL line into one of: `tool_use`, `tool_result`, `agent_text`, `subagent_spawn`, `subagent_done`. |
| **Role inference** | Agent depth `0 → boss`, `1 → supervisor`, `2 → employee`, `≥3 → intern`. |
| **WebSocket broadcast** | All connected clients receive every event as a JSON string over `ws://localhost:7890`. |

**Default watch directories:**

```
~/.claude/projects
~/.codex/sessions
~/.gemini/sessions
~/.opencode/sessions
```

Pass `--watch <dir>` to prepend an additional directory; `--port <n>` to change the port.

**Tool → game-event mapping:**

| CLI tool | Game event type |
|---|---|
| Bash, WebFetch, WebSearch | `tool_bash` |
| Read, Glob, Grep | `tool_read` |
| Write | `tool_write` |
| Edit, NotebookEdit | `tool_edit` |
| Task, TodoWrite | `tool_task` |

---

### Core Engine (`engine.js`)

Four ES-module classes shared between the React UI and any future non-React consumer.

#### `EventBus`

Lightweight pub/sub backbone. All cross-component communication flows through a single shared instance.

```
bus.on(event, handler)   → unsubscribe fn
bus.off(event, handler)
bus.emit(event, data)    → also fires "*" wildcard listeners
```

#### `A2AProtocol`

Implements Google A2A spec semantics locally. Wraps `EventBus` with structured message envelopes and higher-level collaboration primitives.

See [A2A Protocol](#a2a-protocol) for the full message-type reference.

#### `PersonalityEngine`

Converts a `(role, eventType)` pair into context-aware in-character speech and a short work-summary bubble. Uses pre-defined template tables; no LLM call required.

See [Personality Engine](#personality-engine) for details.

#### `TerminalBridge`

Browser-side WebSocket client. Connects to `bridge.js`, translates raw events through `PersonalityEngine`, then fires `EventBus` game events (`game:agent_move`, `game:agent_speak`, `game:a2a_message`, etc.). Falls back to `_startMockEvents()` demo loop on connection failure.

---

### Office Data & World Map (`officeData.js`)

| Export | Purpose |
|---|---|
| `TILE` | Tile size constant (32 px) |
| `WORLD_W / WORLD_H` | World dimensions in tiles (60 × 38) |
| `VIEWPORT_W / VIEWPORT_H` | Visible tile window (26 × 18) |
| `T` | Tile-type ID enum (FLOOR, WALL, DESK, SERVER, …) |
| `TILE_STYLE` | Visual properties per tile type (bg color, border, emoji label) |
| `generateOfficeMap()` | Procedurally builds the full 60 × 38 tile array |
| `WAYPOINTS` | Named `{x, y}` coordinates for every zone and station |
| `DEST_BY_EVENT` | Maps game event type → destination waypoint key |
| `INITIAL_AGENTS` | Full roster of agents with sprites, colors, spawn points, XP |
| `AGENT_ROLES` | Role name constants |
| `XP_TABLE` | XP awarded per action type |
| `EVOLUTION_MILESTONES` | Level → unlocked ability per role |

---

### UI Component (`PixelHQUltra.jsx`)

React 18 component (Vite dev server). Uses `useReducer` for all game state and `useEffect` to wire up the `EventBus` listeners. Key UI sections are defined as functions inside the same file and rendered directly from the root component return:

- **Tile grid** — renders the viewport slice of `OFFICE_MAP` using absolute-positioned `div`s.
- **Agent sprites** — pixel-art characters drawn as nested `div` grids from `SPRITES` data.
- **Speech / work bubbles** — transient overlays auto-expiring after a few seconds.
- **A2A message particles** — animated arcs flying between agent positions.
- **Meeting overlay** — full-screen panel when a meeting is active.
- **HUD** — top bar showing bridge connection status, XP, level, and the terminal correlation feed.

State managed by the reducer includes: `agents`, `camera`, `meeting`, `debate`, `particles`, `revealed` (fog-of-war), `termFeed`, `toasts`, `bridgeConnected`, `selectedAgent`.

---

## Agent Role Hierarchy

```
        ┌──────────┐
        │  boss    │  · Orchestrates the whole team
        │  (gold)  │  · Spawns sub-agents (Task tool)
        └────┬─────┘  · Camera follows the boss
             │
        ┌────▼─────┐
        │supervisor│  · Coordinates employee work
        │  (blue)  │  · Routes blocked tasks up to boss
        └────┬─────┘
             │
       ┌─────┴──────┐
  ┌────▼───┐  ┌─────▼──┐
  │employee│  │employee│  · Feature work, code review, bash
  │(green) │  │ (red)  │  · Peer review via A2A
  └────────┘  └────────┘
       │
  ┌────▼────┐
  │ intern  │  · Learning role, assigned small tasks
  │(orange) │  · Earns "Promoted!" at level 5
  └─────────┘
```

Depth in the agent hierarchy is inferred automatically by `bridge.js` — see [Terminal Bridge Server](#terminal-bridge-server-bridgejs) for the full mapping.

---

## A2A Protocol

Every message is an envelope:

```jsonc
{
  "id":        "msg-<timestamp>-<random>",
  "from":      "<agentId>",
  "to":        "<agentId> | null",   // null = broadcast
  "type":      "<A2A_MSG constant>",
  "payload":   { … },
  "timestamp": 1700000000000
}
```

**Message types (`A2A_MSG`):**

| Constant | Direction | Purpose |
|---|---|---|
| `task_assign` | boss → anyone | Delegate a task |
| `task_complete` | anyone → boss | Signal completion |
| `task_blocked` | anyone → supervisor | Escalate a blocker |
| `peer_review` | employee ↔ employee | Request code review |
| `knowledge_share` | anyone → all | Broadcast a learned insight |
| `meeting_call` | boss → group | Convene a meeting |
| `debate_open` | two agents | Start a structured debate |
| `debate_close` | two agents | Resolve a debate |
| `work_handoff` | any → any | Pass an artifact |
| `status_ping` | any → any | Heartbeat |
| `evolution_vote` | any → all | Vote on a protocol change |

Messages fire on two `EventBus` channels simultaneously:
- `a2a:message` — every message (useful for logging / the terminal feed)
- `a2a:to:<agentId>` — directed messages to a specific agent

---

## Personality Engine

Speech is generated from role × event-type template tables — no runtime LLM call.

**Roles:** `boss` · `supervisor` · `employee` · `intern`

**Event types with templates:** `tool_bash` · `tool_read` · `tool_write` · `tool_edit` · `tool_task` · `thinking` · `complete` · `error` · `meeting` · `debate`

Each slot holds an array of strings; one is picked at random per event.

Work-summary bubbles use separate `WORK_SUMMARIES` formatters that truncate and prefix the stripped content with an appropriate emoji (`$`, `📖`, `✍️`, `✏️`, `📋`, `💭`, `✅`, `⚠️`).

---

## Office Layout

```
╔══════════════════════════════════════════════════════════╗
║  MEETING ROOM  │  OPEN WORKSPACE (desks, terminals)  │BOSS║
║  (carpet, mtbl)│                                     │OFFICE║
╠════════════════╪═══════════════════════════════════════════╣
║                       MAIN HALLWAY                        ║
╠════════════════╪═══════════════════════════════════════════╣
║                │       SUPERVISOR ZONE                    ║
║                │       (sup desks, emp rows)              ║
╠════════════════╪═══════════════════════════════════════════╣
║                       LOWER HALLWAY                       ║
╠════════════════╪═══════════════════════════════════════════╣
║  BREAK ROOM    │                               │ SERVER RM ║
║  (coffee,sofa) │                               │ INTERN DEN║
╚══════════════════════════════════════════════════════════╝
```

| Zone | Tiles (col, row) | Key fixtures |
|---|---|---|
| Meeting Room | 1–13, 1–11 | Meeting table, chairs, whiteboard, plants |
| Open Workspace | 14–44, 1–11 | 3 × 9 desks, terminal stations, filing cabinets |
| Boss Office | 46–58, 1–13 | Executive desk, monitor, sofa, visitor chairs |
| Main Hallway | 1–58, 12–13 | Connects all top-floor zones |
| Supervisor Zone | 14–44, 14–22 | Supervisor row + two employee rows |
| Break Room | 1–13, 25–36 | Coffee station, sofas |
| Server Room / Intern Den | 46–58, 25–36 | Server racks, intern desks, terminal stations |
| Lower Hallway | 1–58, 23–24 | Connects bottom-floor zones |
| Vertical Corridors | col 13, col 45 | Full-height connectors |

**Game event → destination mapping:**

| Event type | Waypoint | Location |
|---|---|---|
| `tool_bash` | `terminalStation` | Open workspace terminal |
| `tool_read` | `filingCabinet` | Open workspace filing row |
| `tool_write` | `workspaceCenter` | Open workspace center |
| `tool_edit` | `workspaceCenter` | Open workspace center |
| `tool_task` | `hallwayCenter` | Main hallway hub |
| `thinking` | `workspaceCenter` | Open workspace center |

---

## Data Flow

```
JSONL log on disk
        │
        │  fs.watch / tailFile()
        ▼
  bridge.js: parseLine()
        │  strip PII, map tool → event type, infer role
        │
        │  WebSocket broadcast (ws://localhost:7890)
        ▼
  TerminalBridge._handleRaw()           [browser]
        │
        ├─► PersonalityEngine.translate(role, content, eventType)
        │        → { casual (speech bubble), summary (work bubble) }
        │
        ├─► bus.emit("game:agent_speak", …)
        ├─► bus.emit("game:agent_work",  …)
        ├─► bus.emit("game:agent_move",  …)   ← destination from TOOL_DESTINATION
        ├─► bus.emit("game:a2a_message", …)   ← on subagent_spawn / done
        └─► bus.emit("game:xp_gain",    …)   ← on subagent_done (+25 XP)

  PixelHQUltra.jsx useEffect listeners
        │
        ▼
  dispatch() → reducer → new state → React re-render
```

---

## Getting Started

### 1. Install dependencies

```bash
cd pixelhq
npm install
```

### 2. Start the Terminal Bridge (optional — enables live mode)

```bash
npm run bridge
# or with a custom port:
npm run bridge:dev   # --port 7890
```

The bridge watches `~/.claude/projects`, `~/.codex/sessions`, `~/.gemini/sessions`, and `~/.opencode/sessions` by default. Start your AI coding agent in another terminal and the bridge will pick up its JSONL log automatically.

### 3. Start the UI

```bash
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`). The office will load in **demo mode** if the bridge is not running, or in **live mode** once the WebSocket handshake succeeds.

### Environment summary

| Component | Command | Port |
|---|---|---|
| Terminal Bridge | `npm run bridge` | `7890` (WebSocket) |
| React UI (dev) | `npm run dev` | `5173` (HTTP, Vite) |
| React UI (prod) | `npm run build` | — |
