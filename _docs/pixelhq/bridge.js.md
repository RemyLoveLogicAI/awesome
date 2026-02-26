<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "pixelhq/bridge.js",
  "source_hash": "0532291cabaf8854cfe9dacd924d0d9ba6e4136766e4a33b4042f254320108d7",
  "last_updated": "2026-02-26T05:01:18.401031+00:00",
  "tokens_used": 24980,
  "complexity_score": 4,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "ws"
  ]
}
```

</details>

[Documentation Home](../README.md) > [pixelhq](./README.md) > **bridge**

---

# bridge.js

> **File:** `pixelhq/bridge.js`

![Complexity: Medium](https://img.shields.io/badge/Complexity-Medium-yellow) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file implements a Node.js terminal bridge that tails .jsonl session logs produced by several CLI agents, sanitizes sensitive content into lightweight structural events, and broadcasts them over a local WebSocket server (default port 7890) for a UI (PixelHQUltra.jsx). It discovers watch roots from WATCH_DIRS (homedir defaults and an optional --watch), scans and tails existing .jsonl files, and watches directories recursively for newly created session files.

Core logic maintains a per-file offset while tailing, parses appended JSONL lines with parseLine(), and applies a strip() privacy gate to redact textual fields. deriveSessionMeta() synthesizes compact session metadata, and the bridge maps raw messages and tool usage into a small set of sanitized events (agent_text, tool_use, subagent_spawn, subagent_done, tool_result) which are JSON-stringified and broadcast to connected WebSocket clients. The implementation favors simplicity (synchronous fs reads and fs.watch) and minimal error handling while making explicit privacy trade-offs via heuristic redaction.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `ws` | External npm package. The code imports the WebSocketServer (const { WebSocketServer } = require('ws')) and instantiates a WebSocket server on the configured PORT. The server accepts connections, tracks clients in a Set, and uses ws.send(payload) to broadcast sanitized events to connected UI clients. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| `fs` | Used extensively for filesystem operations: fs.statSync() to check file size, fs.openSync()/fs.readSync()/fs.closeSync() to read appended bytes when tailing, fs.watch() for change/new-file notifications, fs.readdirSync() to scan directories, fs.existsSync() to check path presence, and fs.watch file-watcher handles which are stored in the watchers Map. |
| `path` | Used for path manipulation: path.join() to build watch directory and full file paths, path.basename() to extract file or filename for privacy stripping and deriveSessionMeta, and path.sep to split filePath when deriving session metadata. |
| `os` | Used to read the current user's home directory (os.homedir()) to construct default WATCH_DIRS for various CLI session storage locations. |

## 📁 Directory

This file is part of the **pixelhq** directory. View the [directory index](_docs/pixelhq/README.md) to see all files in this module.

## Architecture Notes

- Event-driven tailing pipeline: The bridge implements a tailing pattern where each .jsonl file is tailed independently. For each tailed file it maintains an offset (local variable in tailFile), and on fs.watch 'change' events it stat/reads only the appended bytes, splits by newline, and feeds each JSONL line into parseLine().
- Privacy-first parsing: strip() is a lightweight privacy gate that removes or reduces sensitive text by returning only filenames (path.basename) for paths, the verb for shell commands, or "[redacted]" as a fallback. parseLine() uses strip() for any user-facing textual fields before events are broadcast.
- WebSocket broadcast model: The WebSocketServer listens for connections and stores clients in a Set. broadcast(event) JSON.stringifys the event and iterates over the Set sending to clients with readyState === 1 (OPEN). New clients simply begin receiving subsequent events; there is no replay of past events in this implementation.
- Simple metadata derivation: deriveSessionMeta(filePath) synthesizes an agent id (combining a folder suffix and the file basename), guesses a role based on folder naming, and the originating tool string by checking for substrings in the file path. This metadata is used by parseLine to populate agentId and role on events.
- Error & state handling: The file uses mostly synchronous fs operations for tail reads and minimal try/catch around JSON.parse and stat/read operations. Malformed JSON lines are ignored; filesystem exceptions when checking/reading files are swallowed to keep the watcher resilient. SIGINT triggers graceful shutdown closing watchers and the ws server.

## Usage Examples

### Run bridge locally and watch default CLI session directories

Start the bridge: `node bridge.js` (defaults to port 7890). The bridge will construct WATCH_DIRS from the current user's homedir for .claude, .codex, .gemini, and .opencode session paths. It scans those directories recursively and tails any existing .jsonl session files. When a connected UI (e.g., PixelHQUltra.jsx) opens ws://localhost:7890, it will receive subsequent sanitized events emitted by parseLine() — such as agent_text, tool_use, subagent_spawn, subagent_done — each containing agentId, role, toolName (when applicable), and redacted content.

### Tail a new session JSONL file placed in a watched directory

When a new file with .jsonl extension appears under any watched root, fs.watch will detect the filename and call tailFile(fullPath) if not already watched. tailFile will read any initial content, set an offset, and register fs.watch on that file; subsequent writes to the file trigger readNew() which reads only the bytes appended since the last offset, splits into lines, JSON.parse() each line, converts to a sanitized event via parseLine(), and sends it to all WebSocket clients using broadcast().

## Maintenance Notes

- Performance & scalability: The implementation uses fs.watch plus synchronous read operations for each tail, which is simple but may not scale well to large numbers of sessions or very large files. Consider using non-blocking streams (fs.createReadStream with start offsets) or a native tailing library for higher-volume scenarios.
- Platform differences & fs.watch caveats: fs.watch behavior (especially recursive watching) varies by OS. On Linux, recursive watches require inotify support; on some platforms fs.watch may coalesce events or report different event sequences. Tests on target platforms are required. Recursive watching can also be noisy for large directories.
- File rotation/truncation: The code assumes files only grow; if a session file is rotated/truncated, the offset logic may become invalid. A robust implementation should handle stat.size < offset by resetting offset to 0 or re-reading the file header.
- Privacy limits: strip() provides heuristic redaction (path basename and single-token shell verbs). It may not catch complex PII or multi-token secrets embedded in other fields. If stronger guarantees are required, add configurable redaction rules or integrate a dedicated sanitizer.
- Error handling & observability: JSON.parse failures are silently ignored for malformed lines. Consider emitting diagnostic events or logging malformed line counts. The WebSocket send is naive (no backpressure); if clients are slow, consider per-client buffering or closing slow connections.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/pixelhq/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function inferRole

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function inferRole(depth: number = 0): string
```

### Description

Return a role string based on the numeric depth input.


This function takes a single numeric parameter depth (default 0) and returns one of four hard-coded role strings. It checks the depth value against specific integers: 0 maps to "boss", 1 to "supervisor", 2 to "employee"; any other value returns "intern". The implementation uses simple equality comparisons and immediate returns.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `depth` = `0` | `number` | ❌ | A numeric depth value used to determine which role string to return.
<br>**Constraints:** No implicit type coercion is performed in the code; it uses strict equality (===). Supplying non-number values may not match expected cases., Only specific integer values 0, 1, 2 have explicit mappings; all other values result in "intern". |

### Returns

**Type:** `string`

A role name corresponding to the provided depth.


**Possible Values:**

- boss
- supervisor
- employee
- intern

### Usage Examples

#### Default call with no arguments

```javascript
inferRole()
```

Returns "boss" because the default depth is 0.

#### Supervisor level

```javascript
inferRole(1)
```

Returns "supervisor" for depth === 1.

#### Depth not explicitly handled

```javascript
inferRole(10)
```

Returns "intern" because the value doesn't match 0, 1, or 2.

### Complexity

O(1) time complexity and O(1) space complexity — constant-time conditional checks and returns.

### Related Functions

- `N/A` - No other functions are referenced or called by this implementation.

### Notes

- The function uses strict equality (===). Passing values of different types (e.g., strings) will not match numeric cases.
- The mapping is static and limited to the four returned strings; adjust the code to change mappings or support additional depths.

---



#### function strip

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function strip(raw: any): string
```

### Description

Return a sanitized, short string extracted from the input by attempting to keep only a filename or the first token of a command; otherwise return a redaction placeholder.


This function accepts a single input (raw). It first validates that raw is a non-empty string; if not, it immediately returns an empty string. It then attempts to match the input against a regular expression that identifies paths that start with ~/ or / or ./ and captures the following path portion; if that match succeeds it returns the basename of the captured path (using path.basename). If no file-like path is detected, it trims the input and captures the first whitespace-free token (the command verb or first word) and returns that. If none of these matches succeed, it returns the literal string "[redacted]".

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `raw` = `none` | `any (expected string)` | ✅ | The input value to sanitize; expected to be a string containing a file path, shell command, or other text.
<br>**Constraints:** Should be a string for meaningful results, If falsy or not a string the function returns an empty string |

### Returns

**Type:** `string`

A short sanitized string: either an extracted filename, the first token of the input string, an empty string for invalid input, or the literal "[redacted]" when no extraction matches.


**Possible Values:**

- Empty string "" when raw is falsy or not a string
- The basename of a detected file path (string) when a path match is found
- The first token (string) when no path match is found but input has at least one non-whitespace token
- "[redacted]" when input is a string but no tokens or path-like patterns are matched

### Usage Examples

#### Input is a POSIX-like path with leading ~/ or / or ./

```javascript
strip('~/projects/foo/bar.txt')
```

Matches the path regex and returns path.basename('projects/foo/bar.txt') -> 'bar.txt'.

#### Input is a shell command with arguments

```javascript
strip('git commit -m "msg"')
```

No path match; captures first token and returns 'git'.

#### Input is not a string or is falsy

```javascript
strip(null)
```

Returns empty string ''.

#### Input is a string with only whitespace or empty after trimming

```javascript
strip('   ')
```

Trimmed input yields no token; function returns '[redacted]'.

### Complexity

O(n) time where n is the length of the input string (regex matches, trim, and basename operate in linear time); O(1) additional space beyond input and match result (ignoring path.basename internal allocations).

### Related Functions

- `path.basename` - Called by this function to extract the final portion (filename) of a matched file path

### Notes

- The function uses a regular expression to detect leading ~/, /, or ./ paths and captures following characters composed of word characters, dots, slashes, and hyphens ([\w./\-]+).
- path must be available in the module scope for path.basename to work; the snippet assumes path is imported or defined elsewhere.
- If the input is a string containing only whitespace, the function will not find a first token and will return '[redacted]'.
- The function does not throw errors explicitly; however, if path is undefined at runtime, calling path.basename will throw a ReferenceError—this is not shown in the implementation but is an environmental requirement.

---



#### function parseLine

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function parseLine(line: string, sessionMeta: { id: string, role?: string }): { type: string, agentId: string, role: string, toolName: string|null, content: string|null, subAgentId: string|null } | null
```

### Description

Parse a single newline-delimited JSON string representing an agent/tool event and map it to a normalized event object or return null for irrelevant/invalid lines.


The function accepts a text line and session metadata, ignores empty lines, attempts to parse the line as JSON, and then inspects the parsed object to produce a normalized event record. It extracts top-level fields (type, message, tool_use_id, subagent_id, depth). For assistant messages it looks into message.content for blocks of types 'text', 'thinking', or 'tool_use' and maps those to event shapes: agent_text, tool_use, or subagent_spawn (for Task tool). For tool_use blocks it extracts a tool name and input fields (command, file_path, path, query, description) and returns a tool_use event with the chosen content. For tool results (type === 'tool_result') it returns either subagent_done (if is_error === false and subagent_id present) or a generic tool_result event. If parsing fails or the JSON does not match handled shapes, it returns null. The session role is taken from sessionMeta.role if present, otherwise inferred via inferRole(depth || 0). The function calls JSON.parse, inferRole, and strip and uses optional chaining and array find to locate blocks.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `line` | `string` | ✅ | A single line of text expected to be a JSON-encoded event produced by an agent/tool; empty or non-JSON lines are ignored.
<br>**Constraints:** Should be a string containing a single JSON object per line, Empty or whitespace-only strings result in null, If JSON.parse fails, the function returns null |
| `sessionMeta` | `object` | ✅ | Session metadata containing at minimum an id and optionally a role; used to populate agentId and role in the returned event.
<br>**Constraints:** Must be an object with property 'id' (string), May include 'role' (string); if absent, inferRole(depth || 0) is used, Other properties are ignored |

### Returns

**Type:** `{ type: string, agentId: string, role: string, toolName: string|null, content: string|null, subAgentId: string|null } | null`

A normalized event object describing the parsed line, or null when the input line is empty, invalid JSON, or does not match handled event shapes.


**Possible Values:**

- null — when line is empty/whitespace or JSON.parse fails or the JSON doesn't match handled patterns
- { type: 'agent_text', agentId, role, toolName: null, content: <stripped text>, subAgentId: null }
- { type: 'tool_use', agentId, role, toolName: <tool name>|null, content: <stripped input>, subAgentId: null }
- { type: 'subagent_spawn', agentId, role, toolName: 'Task', content: <description/prompt stripped>, subAgentId: <subId> }
- { type: 'subagent_done', agentId, role, toolName: 'Task', content: '[subtask complete]', subAgentId: <subagent_id> }
- { type: 'tool_result', agentId, role, toolName: null, content: null, subAgentId: null }

### Usage Examples

#### Parse an assistant text message line

```javascript
parseLine('{"type":"assistant","message":{"content":[{"type":"text","text":"Hello"}]}}', { id: 'agent-1' })
```

Returns an 'agent_text' event with content 'Hello' and agentId 'agent-1'.

#### Parse a tool use spawning a sub-agent (Task)

```javascript
parseLine('{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Task","input":{"description":"Do work"}}]},"tool_use_id":"t1","subagent_id":"sub-123"}', { id: 'agent-1' })
```

Returns a 'subagent_spawn' event with content 'Do work' and subAgentId 'sub-123' (or derived from tool_use_id if subagent_id missing).

#### Parse a tool_result indicating sub-agent completion

```javascript
parseLine('{"type":"tool_result","is_error":false,"subagent_id":"sub-123"}', { id: 'agent-1' })
```

Returns a 'subagent_done' event referencing the completed subAgentId.

### Complexity

Time: O(m + k) where m is the length of the input JSON string (JSON.parse cost) and k is the number of blocks in message.content if present; Space: O(m) for parsed object and returned small object.

### Related Functions

- `inferRole` - Called by parseLine to determine a role when sessionMeta.role is not provided (relationship: caller -> inferRole).
- `strip` - Called by parseLine to trim/normalize textual content extracted from blocks (relationship: caller -> strip).

### Notes

- The function swallows JSON parsing errors and returns null rather than throwing.
- It relies on the presence and shape of message.content being an array of blocks with a 'type' field.
- For Task tool spawns, subAgentId is taken from subagent_id field if present, otherwise constructed as `sub-${tool_use_id}`.
- Optional chaining (message?.content) is used to safely handle missing message objects.
- If strip or inferRole throw errors, those exceptions will propagate (not handled inside this function).

---



#### function broadcast

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function broadcast(event: any): void
```

### Description

Serialize the provided event to JSON and send that serialized payload to every WebSocket in the global clients collection that is open.


The function JSON.stringify()s the event parameter to produce a payload string, then iterates over a globally available clients collection. For each ws (assumed to be a WebSocket-like object) it checks ws.readyState === 1 (OPEN) and, if open, calls ws.send(payload) to transmit the serialized event to that client. The function does not return a value.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | `any` | ✅ | The value to be serialized and broadcast to connected clients. It will be passed to JSON.stringify().
<br>**Constraints:** Must be serializable by JSON.stringify() or JSON.stringify will throw a TypeError, No validation is performed within the function |

### Returns

**Type:** `void`

No explicit return; the function returns undefined after sending messages (i.e., has no return statement).


**Possible Values:**

- undefined

### Side Effects

> ❗ **IMPORTANT**
> This function has side effects that modify state or perform I/O operations.

- Calls JSON.stringify(event) which allocates a string representation of the event
- Iterates over the global clients collection (reads global state)
- Calls ws.send(payload) on each WebSocket-like client with readyState === 1, causing network I/O (sends data over WebSocket connections)

### Usage Examples

#### Broadcast a simple event object to all connected, open WebSocket clients

```javascript
broadcast({ type: 'update', data: { x: 1 } });
```

Serializes the object to JSON and sends it to every client in the global clients collection whose readyState equals 1 (OPEN).

### Complexity

Time complexity O(n) where n is the number of entries in the clients collection because each client is visited once; space complexity O(m) where m is the size (in characters) of JSON.stringify(event) because the function creates a single payload string.

### Related Functions

- `clients (global variable)` - broadcast iterates over this collection; clients is a required external collection of WebSocket-like objects the function depends on

### Notes

- The function assumes a global clients collection and WebSocket-like objects with readyState and send methods.
- The code checks readyState === 1 and uses the numeric constant inline with a comment /* OPEN */.
- If JSON.stringify throws (e.g., due to circular references), the exception will propagate to the caller since it is not caught here.
- If ws.send throws for a particular client, that exception will also propagate because there is no try/catch inside the loop.

---



#### function deriveSessionMeta

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function deriveSessionMeta(filePath: string): { id: string, role: string, tool: string }
```

### Description

Extract a short session/agent metadata object (id, role, tool) from a file path string by parsing folder and file name parts.


This function takes a filesystem path string and derives three metadata fields: id, role, and tool. It splits the path on the platform-specific path separator to obtain path segments, uses the penultimate segment as the folder name (falling back to "agent" if not present), and derives a file base name by removing a .jsonl extension. The id is constructed by concatenating the last up-to-6 characters of the folder and the last up-to-4 characters of the file base name, joined with a hyphen. The role is set to "employee" when the folder name includes the substring "subagent", otherwise it is "boss". The tool is selected by checking for specific substrings in the original filePath in this order: if it contains ".codex" -> "codexcli"; else if it contains ".gemini" -> "geminicli"; else if it contains ".opencode" -> "opencode"; otherwise -> "claudecode". The function returns an object with properties { id, role, tool }.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `filePath` | `string` | ✅ | A filesystem path string pointing to a .jsonl file (or similar) used to infer session/agent metadata.
<br>**Constraints:** Expected to be a string, Function uses path.sep and path.basename, so typical OS path format is expected, If the path does not contain at least one directory segment, folder falls back to "agent" |

### Returns

**Type:** `{ id: string, role: string, tool: string }`

An object containing a short id derived from folder and filename, a role ('employee' or 'boss'), and a tool identifier inferred from substrings in the path.


**Possible Values:**

- {"id": string formed as `${folder.slice(-6)}-${fileId.slice(-4)}`}
- {"role": "employee"} or {"role": "boss"}
- {"tool": "codexcli", "geminicli", "opencode", or "claudecode"}

### Usage Examples

#### Derive metadata from a typical agent file path containing .jsonl and a folder that includes 'subagent'

```javascript
deriveSessionMeta('/home/me/agents/subagent-123/agentA.jsonl')
```

Returns an object like { id: 'agent-1234', role: 'employee', tool: 'claudecode' } where id uses the last chars of folder and file base name; tool is 'claudecode' because no special substring matched.

#### File path indicating a codex tool

```javascript
deriveSessionMeta('C:\projects\team\boss\myfile.codex.jsonl')
```

Returns tool 'codexcli' because the path contains '.codex'; role will be 'boss' unless the folder contains 'subagent'.

### Complexity

Time complexity: O(n) in the length of filePath (splitting and substring checks). Space complexity: O(n) for creating parts and derived strings.

### Related Functions

- `path.basename` - Called by this function to obtain the file name without extension

### Notes

- The function uses path.sep and path.basename (from Node's path module) but does not import path within its body; caller file is expected to have path available in scope.
- Id construction truncates folder to its last 6 characters and file base name to its last 4 characters which may produce collisions for short names.
- Tool detection is based solely on substring presence in the filePath and checks in a specific priority order: .codex, .gemini, .opencode, else defaults to claudecode.
- No explicit validation or error handling is performed for non-string inputs.

---



#### function tailFile

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function tailFile(filePath: string): void
```

### Description

Starts watching a file at the given path and incrementally reads and processes newly appended content, broadcasting parsed events for each new line.


This function checks a global 'watchers' map to avoid duplicating watchers for the same file. It derives session metadata for the file via deriveSessionMeta(filePath), tracks an offset of already-read bytes, and installs an fs.watch listener on file changes. When the file changes (or immediately after installation), it synchronously stats the file and, if the file has grown, opens the file, reads the newly appended bytes into a Buffer, updates the offset, converts the bytes to a UTF-8 string, splits that text on newlines, and for each line calls parseLine(line, sessionMeta). For each non-falsy parsed event it calls broadcast(event) and logs a console message. The function stores the watcher and sessionMeta in the global watchers map and performs an initial read to process existing content.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `filePath` | `string` | ✅ | Filesystem path of the file to tail/watch for appended content.
<br>**Constraints:** Must be a valid path string, File may need to be readable by the process, Behavior depends on a global 'watchers' Map and functions deriveSessionMeta, parseLine, broadcast being defined |

### Returns

**Type:** `void`

Does not return a value; side effects are used to emit events and manage watchers.


**Possible Values:**

- undefined (no explicit return)

### Raises

| Exception | Condition |
| --- | --- |
| `Error` | Synchronous filesystem operations (fs.openSync, fs.readSync, fs.closeSync, fs.watch) can throw if permissions, file existence, or fd errors occur; statSync is called inside a try/catch for the initial check but other fs.* sync calls are not guarded here. |

### Side Effects

> ❗ **IMPORTANT**
> This function has side effects that modify state or perform I/O operations.

- Reads filesystem metadata and file contents using fs.statSync, fs.openSync, fs.readSync, fs.closeSync
- Creates an fs.watch watcher on the file (fs.watch)
- Allocates Buffers and converts bytes to UTF-8 strings
- Mutates a global 'watchers' Map by calling watchers.set(filePath, { watcher, sessionMeta })
- Calls external functions deriveSessionMeta, parseLine, and broadcast
- Writes to stdout via console.log

### Usage Examples

#### Start tailing a log file and process appended lines

```javascript
tailFile('/var/log/myapp.log');
```

Installs a watcher to process any currently present content and any lines appended later; parsed events will be broadcast via broadcast(event).

### Complexity

Time: O(k) per readNew invocation where k is the number of newly appended bytes (reading and splitting those bytes). Overall cost depends on how often the file grows and the amount appended. Space: O(k) for the Buffer and resulting string for each read; uses constant additional space for metadata.

### Related Functions

- `deriveSessionMeta` - Called by tailFile to obtain metadata used when parsing lines
- `parseLine` - Called by tailFile for each line of newly read text to produce an event object
- `broadcast` - Called by tailFile to emit any events produced by parseLine

### Notes

- The function prevents duplicate watchers by checking watchers.has(filePath) at the start.
- statSync is wrapped in a try/catch in readNew to silently return if the file cannot be stat'ed; other fs operations are not try/catch-protected and may throw.
- The code treats file growth only; it ignores truncation (if stat.size <= offset it returns without resetting offset).
- Splitting on '\n' may yield an empty trailing element if text ends with a newline; parseLine is invoked for each split line, so parseLine must handle empty or partial lines appropriately.
- Reads are synchronous (fs.*Sync). This blocks the event loop while reading large appended chunks.
- Assumes a global Map named 'watchers' exists in scope and that deriveSessionMeta/parseLine/broadcast are available.

---



#### function watchDir

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
watchDir(dir: string): void
```

### Description

Watches a directory tree for existing and newly added .jsonl files and starts tailing them via tailFile.


This function checks that the provided directory exists, sets up a recursive fs.watch on it to detect newly created or changed files, filters events to only .jsonl filenames, and for each matching file that exists and is not already tracked in the watchers collection, logs a message and calls tailFile(fullPath). After installing the watcher, it synchronously scans the directory tree (recursively) using fs.readdirSync to find any existing .jsonl files and calls tailFile for each. Errors thrown during the synchronous scan are swallowed (empty catch block).

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `dir` | `string` | ✅ | Path to the directory to watch and scan for .jsonl files
<br>**Constraints:** Must be a path string, Directory must exist (function returns early if it does not) |

### Returns

**Type:** `void`

Does not return a value; may return early (undefined) if the directory does not exist


**Possible Values:**

- undefined (no explicit return value)

### Side Effects

> ❗ **IMPORTANT**
> This function has side effects that modify state or perform I/O operations.

- Calls fs.existsSync(dir) to check for directory existence
- Starts a file system watcher via fs.watch(dir, { recursive: true }, ...)
- Reads directory contents and file system metadata synchronously via fs.readdirSync and Dirent methods
- Logs to console via console.log
- Calls tailFile(full) for matched files (causes whatever side effects tailFile has)
- Accesses the global watchers collection (reads watchers.has) which may affect external state

### Usage Examples

#### Start watching a session directory for JSONL session files

```javascript
watchDir('/var/lib/pixelhq/sessions')
```

Installs a recursive watcher on the sessions directory and tails any existing or newly created .jsonl files under it.

### Complexity

Time complexity: O(n) for the initial synchronous scan where n is the number of entries in the directory tree; the watch callback runs per filesystem event (cost per event is O(1) for checks and tailFile invocation). Space complexity: O(1) extra space besides the filesystem watcher and any memory used by tailFile or the watchers collection.

### Related Functions

- `tailFile` - Calls tailFile to start processing/tailing each discovered .jsonl file

### Notes

- The function silently swallows errors thrown during the synchronous directory scan (empty catch block).
- fs.watch is used with recursive: true, which is supported on some platforms (notably Windows and macOS) but behavior may vary on Linux depending on Node version.
- The function checks a global watchers collection to avoid double-tailing files but does not modify watchers itself; modification likely happens inside tailFile.
- Filename provided by fs.watch may be undefined; the code guards against that.
- Only files whose names end with ".jsonl" are considered.

---


