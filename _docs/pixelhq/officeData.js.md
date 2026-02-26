<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "pixelhq/officeData.js",
  "source_hash": "20d37053f855d089afbb4bff0348c97d0717264329e4b50e9fef78977bfd9d07",
  "last_updated": "2026-02-26T05:00:07.641960+00:00",
  "tokens_used": 21957,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../README.md) > [pixelhq](./README.md) > **officeData**

---

# officeData.js

> **File:** `pixelhq/officeData.js`

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

This file is a self-contained data and map-definition module for a top-down office simulation. It exports numeric layout constants (TILE, WORLD_W/H, VIEWPORT_W/H), a T object that enumerates tile type IDs, TILE_STYLE which maps tile IDs to visual styling (background colors, borders, emoji labels), and helper functions that procedurally populate a 2D tile map array. The map generator functions present are fill(map, x, y, w, h, type), wall(map, x, y, w, h), glassWall(map, x, y, w, h) and the exported generateOfficeMap() which returns a WORLD_H × WORLD_W 2D array filled with tile IDs from T. The generator composes building zones (meeting room, boss office, open workspace, supervisor zone, break room, server room, hallways), places fixtures (desks, chairs, monitors, plants, windows), and marks special tiles (terminal stations and filing cabinets).

In addition to map data, the file provides navigation and simulation data: WAYPOINTS (named x/y coordinates used by agents), DEST_BY_EVENT (maps event types to waypoint names), AGENT_ROLES enum, pixel-art SPRITES for multiple agent types, and INITIAL_AGENTS — a list of agent objects (id, name, role, sprite, color/accent, tool, spawn coordinate or waypoint reference, homeWaypoint name, xp/level info, state, bubbles, currentTask, stats, evolution). It also exports XP_TABLE and EVOLUTION_MILESTONES which define experience rewards and level-based unlocks. The module contains no imports and is intended to be consumed by other parts of the system (renderers, AI/agent controllers, simulation loop) which read these exported constants, call generateOfficeMap() to get the layout, and instantiate agents according to INITIAL_AGENTS and WAYPOINTS.

## Dependencies

No dependencies identified.

## 📁 Directory

This file is part of the **pixelhq** directory. View the [directory index](_docs/pixelhq/README.md) to see all files in this module.

## Architecture Notes

- Data-first module: This file exports pure data structures and a deterministic map generator — there are no external side-effecting calls or imports. Consumers should call generateOfficeMap() once (or whenever a fresh map is needed) to obtain a 2D array of tile IDs.
- Tile abstraction: Tile types are numeric IDs in T; TILE_STYLE provides presentation info (bg, border, label, optional solid flag). Renderers should use T and TILE_STYLE together to draw the map and to determine walkability (note: 'solid' exists only for T.WALL and can be used by movement/collision logic).
- Procedural helpers: fill performs rectangle fills and clamps assignments to WORLD_W/WORLD_H; wall and glassWall draw outlines only and do not perform explicit bounds checking — callers must ensure coordinates are valid or risk accessing undefined map indices.
- Sprite format: SPRITES entries contain pixel-art arrays where each cell is either 0 (transparent) or a CSS color string. The file-level comment claims '7 wide × 12 tall' but the provided sprite arrays have 9 rows; consumers must handle variable row counts or normalize to expected renderer dimensions.
- Agent integration: INITIAL_AGENTS items sometimes reference a direct spawn coordinate (object with x,y) or a waypoint (WAYPOINTS.*). Consumers should resolve spawn to concrete coordinates before placing agents. Agents reference homeWaypoint by name (string) which must be looked up in WAYPOINTS when needed.

## Usage Examples

### Generate the tile map and render the office background

Call generateOfficeMap() to obtain a 2D array map[row][col] sized WORLD_H × WORLD_W where each cell holds a numeric tile ID from T. A renderer iterates rows/cols and for each tile ID uses TILE_STYLE[tileId] to obtain background color, border and optional label (e.g., emojis). Example sequence: const map = generateOfficeMap(); for (let y=0; y<WORLD_H; y++) for (let x=0; x<WORLD_W; x++) { const tile = map[y][x]; const style = TILE_STYLE[tile]; drawTile(x,y, style.bg, style.border, style.label); }.

### Spawn agents based on INITIAL_AGENTS and WAYPOINTS

Read INITIAL_AGENTS array to instantiate agent objects in the simulation. For each agent, resolve spawn: if spawn is an object with x and y use it directly; if spawn is a reference to WAYPOINTS (the code uses direct references for some agents like WAYPOINTS.supDesk1), ensure the consumer dereferences to {x,y}. Set agent.position = resolved spawn and use agent.homeWaypoint (string) to find a home waypoint in WAYPOINTS when returning agents to their desks. Example: const agent = INITIAL_AGENTS[0]; const spawn = typeof agent.spawn === 'object' ? agent.spawn : WAYPOINTS[agent.spawn]; placeAgent(agent.id, spawn.x, spawn.y);

## Maintenance Notes

- Performance: generateOfficeMap builds a WORLD_H×WORLD_W array with nested loops and multiple fills; this is inexpensive for the current WORLD_W=60 × WORLD_H=38 but may need optimization if map size grows significantly. Avoid calling generateOfficeMap on every frame — call once per new level/scene.
- Bounds safety: fill checks bounds before assignment, but wall() and glassWall() do not. If future code calls wall/glassWall with coordinates outside the world, it will throw. Consider adding the same bounds guard as fill or centralizing all tile writes through a safe setter.
- Sprite dimensions: The file comment and actual sprite arrays disagree (comment: 7×12; arrays: 9 rows). Update either the sprite data or the renderer's expected height to avoid rendering issues. Renderers should be robust to varying row counts.
- Extensibility: TILE_STYLE entries include labels (emoji) and an optional 'solid' flag for walls. If movement/pathfinding needs more metadata (e.g., walkable, cost, blocking), extend the TILE_STYLE objects or add a separate TILE_META mapping to avoid overloading visual style with logic flags.
- Testing: Unit tests should verify generateOfficeMap returns consistent placements for critical tiles (doors, terminal stations, filing cabinets) and that WAYPOINTS coordinates match tile types in the generated map where appropriate (e.g., WAYPOINTS.terminalStation should point to a T.TERMINAL_STATION tile).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/pixelhq/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function fill

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function fill(map: Array<Array<any>>, x: number, y: number, w: number, h: number, type: any): void
```

### Description

Mutates a 2D array 'map' by setting each cell in the rectangular region defined by (x, y, w, h) to the provided 'type', skipping assignments that fall outside the global WORLD_H and WORLD_W bounds.


The function iterates row-wise and column-wise over the rectangle starting at coordinates (x, y) with width w and height h. For each coordinate (col, row) within that iteration it checks whether row is in [0, WORLD_H) and col is in [0, WORLD_W). If the coordinate is within those bounds, it assigns map[row][col] = type. The function performs no explicit return; it mutates the provided map in-place. The loops use standard for-loop semantics; if w or h cause the loop ranges to be empty (e.g., non-positive dimensions), no assignments occur. The function references global constants WORLD_H and WORLD_W to determine valid indices.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `map` | `Array<Array<any>>` | ✅ | A mutable 2D array (array of rows) representing the grid; indexed as map[row][col].
<br>**Constraints:** Should be an array of arrays such that map[row][col] is a valid l-value for writable cells, Rows are indexed by first index (row), columns by second index (col) |
| `x` | `number` | ✅ | The starting column index (inclusive) of the rectangle to fill.
<br>**Constraints:** Integer expected (but not enforced). Negative values are allowed; assignments outside bounds are skipped by bounds check. |
| `y` | `number` | ✅ | The starting row index (inclusive) of the rectangle to fill.
<br>**Constraints:** Integer expected (but not enforced). Negative values are allowed; assignments outside bounds are skipped by bounds check. |
| `w` | `number` | ✅ | Width of the rectangle (number of columns). The loop iterates col from x to x + w - 1.
<br>**Constraints:** If w <= 0 the column loop will be empty and no assignments will occur, Integer expected (but not enforced) |
| `h` | `number` | ✅ | Height of the rectangle (number of rows). The loop iterates row from y to y + h - 1.
<br>**Constraints:** If h <= 0 the row loop will be empty and no assignments will occur, Integer expected (but not enforced) |
| `type` | `any` | ✅ | The value to assign into each cell within the rectangle.
<br>**Constraints:** Any JS value is permitted; map cells will reference this value after assignment |

### Returns

**Type:** `undefined`

No explicit return value; the function returns undefined and performs in-place mutations on 'map'.


**Possible Values:**

- undefined

### Side Effects

> ❗ **IMPORTANT**
> This function has side effects that modify state or perform I/O operations.

- Mutates the provided map 2D array: assigns map[row][col] = type for each in-bounds cell in the rectangle
- Reads global variables WORLD_H and WORLD_W to determine bounds

### Usage Examples

#### Fill a 3x2 rectangle starting at (2,1) with value 5

```javascript
fill(grid, 2, 1, 3, 2, 5);
```

Sets grid[row][col] = 5 for row in [1,2] and col in [2,3,4], skipping any coordinates outside WORLD_H/WORLD_W.

#### Calling with rectangle partially outside bounds

```javascript
fill(grid, -1, 0, 4, 3, 'wall');
```

Only cells with 0 <= row < WORLD_H and 0 <= col < WORLD_W are assigned; negative columns are ignored due to bounds checks.

### Complexity

Time: O(w * h) iterations (each cell in the rectangle is visited once though assignments only occur for in-bounds cells). Space: O(1) additional space (in-place).

### Related Functions

- `None explicitly referenced in implementation` - No direct calls to other functions; relies on global WORLD_H and WORLD_W

### Notes

- Function does not validate types of parameters; passing non-numeric values for x,y,w,h may produce runtime behavior consistent with JS for-loop semantics.
- If map rows are shorter than WORLD_W or missing, out-of-range indexing (map[row][col]) could throw a runtime error; the function only guards col/row against WORLD_W/WORLD_H, not against actual row length.
- Negative or non-integer coordinates are handled only by JavaScript loop and the explicit numeric comparisons; behavior for non-integer indices will attempt to index map with non-integer which typically coerces to string and may produce unexpected results.

---



#### function wall

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function wall(map, x, y, w, h)
```

### Description

Mutates a 2D array 'map' by setting the cells on the perimeter of the rectangular region defined by (x,y) with width w and height h to T.WALL.


Iterates over rows from y to y + h - 1 and columns from x to x + w - 1. For each cell in that rectangle, if the cell lies on the rectangle's outer boundary (top row, bottom row, left column, or right column), the function assigns map[row][col] = T.WALL. Interior cells (not on the border) are left unchanged. The function does not return a value.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `map` | `Array<Array<any>>` | ✅ | A two-dimensional array (grid) indexed as map[row][col]; the function will mutate entries in this array.
<br>**Constraints:** Must be an array of arrays accessible with map[row][col], Rows and columns covering the rectangle (y..y+h-1, x..x+w-1) must exist to avoid runtime indexing errors |
| `x` | `number` | ✅ | The column index of the rectangle's top-left corner.
<br>**Constraints:** Typically an integer >= 0, x + w - 1 must be within valid column indices of map |
| `y` | `number` | ✅ | The row index of the rectangle's top-left corner.
<br>**Constraints:** Typically an integer >= 0, y + h - 1 must be within valid row indices of map |
| `w` | `number` | ✅ | The width of the rectangle (number of columns).
<br>**Constraints:** Typically a positive integer (w >= 1), If w <= 0 the loops will not run; behaviour depends on JavaScript loop semantics |
| `h` | `number` | ✅ | The height of the rectangle (number of rows).
<br>**Constraints:** Typically a positive integer (h >= 1), If h <= 0 the loops will not run; behaviour depends on JavaScript loop semantics |

### Returns

**Type:** `undefined`

This function does not return a value; it performs in-place mutation of the provided map array.


**Possible Values:**

- undefined

### Side Effects

> ❗ **IMPORTANT**
> This function has side effects that modify state or perform I/O operations.

- Mutates the provided map 2D array by assigning map[row][col] = T.WALL for perimeter cells of the specified rectangle
- Reads the global/outer-scope identifier T.WALL (depends on T being defined)

### Usage Examples

#### Draw a wall outline on an existing grid

```javascript
wall(grid, 2, 3, 5, 4);
```

Sets the border cells of the rectangle starting at column 2, row 3 with width 5 and height 4 to T.WALL on the grid array.

#### Single-cell rectangle

```javascript
wall(grid, 1, 1, 1, 1);
```

Because width and height are 1, the single cell at (1,1) is on the perimeter and will be set to T.WALL.

### Complexity

Time: O(w * h) because it iterates over every cell in the specified rectangle (checks each for perimeter membership). Space: O(1) additional space (in-place mutation).

### Related Functions

- `room` - Likely complementary in this codebase (e.g., may fill an entire rectangle), but not referenced in this implementation

### Notes

- The function uses strict equality checks to determine perimeter cells (row === y, row === y + h - 1, col === x, col === x + w - 1).
- No bounds checks are performed; calling code must ensure the rectangle lies within map dimensions to avoid runtime errors.
- T.WALL must be defined in the surrounding scope for assignments to succeed.

---



#### function glassWall

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```javascript
function glassWall(map, x, y, w, h)
```

### Description

Sets the border cells of a rectangular region in a 2D map array to T.GLASS.


Iterates over the rows and columns that define a rectangle starting at (x, y) with width w and height h. For each cell on the rectangle's perimeter (top row, bottom row, left column, right column), the function assigns the value T.GLASS into the provided map 2D array. The function performs in-place mutation of the map and does not return a value.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `map` | `Array<Array<any>>` | ✅ | A 2D array (array of rows) representing the map; indexed as map[row][col].
<br>**Constraints:** Must be a mutable 2D array (rows are arrays) accessible via map[row][col]., Must contain at least y + h rows and each relevant row must contain at least x + w columns to avoid runtime indexing errors. |
| `x` | `number` | ✅ | The column index of the rectangle's left edge (starting x coordinate).
<br>**Constraints:** Expected to be an integer (column index)., x >= 0 and x < number of columns in the targeted rows. |
| `y` | `number` | ✅ | The row index of the rectangle's top edge (starting y coordinate).
<br>**Constraints:** Expected to be an integer (row index)., y >= 0 and y < number of rows in map. |
| `w` | `number` | ✅ | The width of the rectangle in columns.
<br>**Constraints:** Expected to be a positive integer (w > 0)., y + h - 1 and x + w - 1 must be within map bounds for the perimeter to be fully addressable. |
| `h` | `number` | ✅ | The height of the rectangle in rows.
<br>**Constraints:** Expected to be a positive integer (h > 0)., y + h - 1 and x + w - 1 must be within map bounds for the perimeter to be fully addressable. |

### Returns

**Type:** `undefined`

No explicit return; function returns undefined. It performs in-place updates on the provided map.


**Possible Values:**

- undefined

### Side Effects

> ❗ **IMPORTANT**
> This function has side effects that modify state or perform I/O operations.

- Mutates the provided map 2D array by setting perimeter cells of the specified rectangle to T.GLASS
- Reads the global identifier T (expects T.GLASS to be defined)

### Usage Examples

#### Mark a 4x3 rectangular window border starting at column 10, row 5

```javascript
glassWall(map, 10, 5, 4, 3);
```

This sets map[5][10..13], map[7][10..13], and the left/right edges at columns 10 and 13 for rows 5..7 to T.GLASS.

#### Small 1x1 rectangle (single cell)

```javascript
glassWall(map, 2, 2, 1, 1);
```

With w=1 and h=1 the single cell at map[2][2] is on the perimeter and will be set to T.GLASS.

### Complexity

Time: O(w * h) because it visits each cell in the rectangle's area to test perimeter membership; Space: O(1) additional space (in-place updates).

### Related Functions

- `None visible in this snippet` - No direct calls to or from other functions are visible in the implementation.

### Notes

- The function only assigns T.GLASS to perimeter cells; interior cells (when w>2 and h>2) are not modified.
- No bounds checking is performed; calling code must ensure indices are valid to avoid runtime errors.
- The function relies on a global T object with a GLASS property being defined in scope where this function runs.

---


