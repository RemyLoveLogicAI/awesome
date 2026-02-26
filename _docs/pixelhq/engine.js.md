<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "pixelhq/engine.js",
  "source_hash": "b41b0eceb1cd441d1aac08b19dd53b94742e763c7e53b5548181c79d6c617725",
  "last_updated": "2026-02-26T04:59:27.698657+00:00",
  "tokens_used": 10129,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../README.md) > [pixelhq](./README.md) > **engine**

---

# engine.js

> **File:** `pixelhq/engine.js`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file provides three primary subsystems and several shared constants used by a front-end “game” or simulation layer. EventBus implements a minimal observer/pub-sub system with .on(event, handler) -> unsubscribe, .off(event, handler), and .emit(event, data) and stores listeners in a Map<string, Set<function>>. A2AProtocol is a thin agent-to-agent messaging abstraction that models local message semantics (task assignments, meeting calls, debates, work handoffs). It keeps in-memory Maps for meetings, debates, and workItems and emits messages to the EventBus when sending messages or recording state changes. PersonalityEngine holds role-based speech templates (SPEECH_TEMPLATES) and work-summary formatters (WORK_SUMMARIES) and exposes speak(), summarize(), and translate() to convert raw CLI output into a casual speech line and a short summary string for UI consumption.

TerminalBridge connects an external WebSocket streaming JSONL events (bridge.js) to the EventBus and the in-memory engine. It maps incoming toolName/type to internal event types using TOOL_EVENT_MAP and TOOL_DESTINATION, calls engine.translate(...) to produce role-flavored text/summary, and then emits a set of game-specific events (GAME_AGENT_SPEAK, GAME_AGENT_WORK, GAME_AGENT_MOVE, GAME_A2A_MESSAGE, GAME_XP_GAIN, GAME_MEETING_START). TerminalBridge has a simple reconnect/backoff strategy (reconnectDelay doubled up to 30s), falls back to a mock/demo event loop when connect fails or on WebSocket error, and uses global WebSocket in the environment (no imports). All data is transient and kept in-memory (Maps/Objects) with no persistence or network services other than the optional WebSocket connection.

## Dependencies

No dependencies identified.

## 📁 Directory

This file is part of the **pixelhq** directory. View the [directory index](_docs/pixelhq/README.md) to see all files in this module.

## Architecture Notes

- Implements Observer pattern via EventBus: _listeners is a Map where keys are event names and values are Sets of handler functions; on(event, handler) returns an unsubscribe closure.
- A2AProtocol uses the EventBus for cross-agent communication: send(...) emits a generic 'a2a:message' then emits either 'a2a:to:{toId}' or 'a2a:broadcast' depending on toId being null. Meetings, debates, and work items are tracked in-memory using Maps (this.meetings, this.debates, this.workItems).
- PersonalityEngine is deterministic except for speak() which picks a random line from SPEECH_TEMPLATES for the role/eventType; summarize() uses WORK_SUMMARIES to create short human-friendly summary strings used by the UI.
- TerminalBridge maps external CLI/bridge events into game events: it transforms incoming JSON (type, agentId, toolName, content, subAgentId, role) → uses TOOL_EVENT_MAP to determine eventType → calls engine.translate(role, content, eventType) → emits GAME_AGENT_SPEAK and GAME_AGENT_WORK, optionally GAME_AGENT_MOVE, GAME_A2A_MESSAGE, and GAME_XP_GAIN.
- Error handling is minimal: JSON parse errors in ws.onmessage are swallowed, WebSocket errors switch TerminalBridge to mockMode, and reconnection uses exponential backoff (min 1s, max 30s).

## Usage Examples

### Publish and subscribe to custom events with EventBus

Register a handler: const unsubscribe = bus.on('my:event', data => { /* react */ }); The handler will be called when bus.emit('my:event', payload) is invoked. To stop listening call unsubscribe() which internally calls off('my:event', handler). The EventBus also supports a wildcard '*' listener that receives { event, data } for every emitted event.

### Send an agent-to-agent task and record a meeting

Create A2AProtocol tied to an EventBus instance: const a2a = new A2AProtocol(bus). To assign work: a2a.assignTask('boss', 'emp1', { title: 'Audit auth' }) which internally calls send(...) and emits 'a2a:message' and 'a2a:to:emp1'. To convene a meeting: const id = a2a.callMeeting('boss', ['emp1','sup1'], 'Sprint planning') which stores a meeting object in a2a.meetings keyed by meetingId and emits a broadcast MEETING_CALL message on the bus.

### Run TerminalBridge to stream external CLI events into game events

Instantiate TerminalBridge with a bus and the PersonalityEngine: const bridge = new TerminalBridge(bus, engine, 'ws://host:7890'); call bridge.connect(). When messages arrive, _handleRaw parses role and content, uses engine.translate(role, content, eventType) to get casual and summary, and emits GAME_AGENT_SPEAK and GAME_AGENT_WORK. If the WebSocket fails, TerminalBridge enters mockMode and starts emitting demo events from _startMockEvents().

## Maintenance Notes

- WebSocket lifecycle: connect() binds onopen/onclose/onerror/onmessage. onerror toggles mockMode and starts the demo event loop; onclose schedules reconnect with exponential backoff (reconnectDelay doubled up to 30000 ms). Ensure environment provides a global WebSocket (browser or polyfill) when used server-side.
- Memory growth: A2AProtocol stores meetings, debates, and workItems indefinitely in Maps. If many meetings/debates are created, consider adding cleanup/TTL logic or persisting to external storage.
- Concurrency and handler behavior: EventBus executes handlers synchronously in the order of iteration. Long-running handlers will block other handlers; consider scheduling heavy work asynchronously (setTimeout/Promise) within handlers.
- Determinism & randomness: PersonalityEngine.speak() randomly selects a line. Tests relying on predictable output should mock Math.random or the speak() method.
- Mock events: _startMockEvents() runs an interval-like recursive timeout to emit demo data; during tests set mockMode or mock/override _handleRaw to avoid timing issues.
- Error swallowing: JSON parse errors in ws.onmessage are caught and ignored which hides malformed input; consider logging parse errors for debugging.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/pixelhq/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
