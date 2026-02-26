// ═══════════════════════════════════════════════════════════════════════════════
// 🐾 CODEMON — Digital Companion Creatures of PixelHQ ULTRA
//
// Original creature designs, NOT Pokémon IP.
// Inspired by: the companion bond, type system, stat cards, evolution fantasy.
// Each creature is a 12×16 pixel grid (4px/cell = 48×64 rendered).
// Colors follow /pixelcraft skill palette.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Type system ─────────────────────────────────────────────────────────────
export const CODEMON_TYPES = {
  LEGENDARY: { name: "LEGENDARY", hi: "#FFD700", base: "#B8860B", shadow: "#5a3a00", glow: "#FFD70088" },
  CODE:      { name: "CODE",      hi: "#86EFAC", base: "#22C55E", shadow: "#15803D", glow: "#22C55E66" },
  BUILD:     { name: "BUILD",     hi: "#FED7AA", base: "#FB923C", shadow: "#9A3412", glow: "#FB923C66" },
  TEST:      { name: "TEST",      hi: "#FCA5A5", base: "#EF4444", shadow: "#991B1B", glow: "#EF444466" },
  ORDER:     { name: "ORDER",     hi: "#BAE6FD", base: "#4169E1", shadow: "#1E3A8A", glow: "#4169E166" },
  GLITCH:    { name: "GLITCH",    hi: "#D8B4FE", base: "#A855F7", shadow: "#7E22CE", glow: "#A855F766" },
  DEPLOY:    { name: "DEPLOY",    hi: "#7DD3FC", base: "#38BDF8", shadow: "#0369A1", glow: "#38BDF866" },
  LEGACY:    { name: "LEGACY",    hi: "#D6D3D1", base: "#78716C", shadow: "#292524", glow: "#78716C44" },
};

// ─── Sprite shorthand helpers ─────────────────────────────────────────────────
const _ = 0; // transparent

// ─── ARCHIMAIN — Legendary / Boss companion ───────────────────────────────────
// Shape metaphor: Celestial serpentine drake with circuit-board wings.
// Dominant gold body, white circuit traces, cyan eye cores.
const ARCHIMAIN_IDLE = [
  [_,  _,  _,  "#FFD700","#FFD700",_,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  "#B8860B","#FFD700","#FFD700","#FFD700","#B8860B",_,  _,  _,  _,  _  ],
  [_,  "#5a3a00","#FFD700","#FFF","#00FFFF","#FFF","#FFD700","#5a3a00",_,  _,  _,  _  ],
  [_,  "#FFD700","#FFD700","#FFF","#FFF","#FFF","#FFD700","#FFD700",_,  _,  _,  _  ],
  [_,  "#B8860B","#FFD700","#FFD700","#FFD700","#FFD700","#FFD700","#B8860B",_,  _,  _,  _  ],
  ["#5a3a00","#FFD700","#FFD700","#B8860B","#FFD700","#B8860B","#FFD700","#FFD700","#5a3a00",_,  _,  _  ],
  [_,  "#B8860B","#FFD700","#FFD700","#FFD700","#FFD700","#FFD700","#B8860B",_,  _,  _,  _  ],
  [_,  _,  "#FFD700","#B8860B","#FFD700","#B8860B","#FFD700",_,  _,  _,  _,  _  ],
  [_,  _,  _,  "#FFD700","#FFD700","#FFD700",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  "#B8860B",_,  "#B8860B",_,  _,  _,  _,  _,  _  ],
  [_,  _,  "#5a3a00","#FFD700",_,  "#FFD700","#5a3a00",_,  _,  _,  _,  _  ],
  [_,  "#5a3a00","#FFD700","#FFD700",_,  "#FFD700","#FFD700","#5a3a00",_,  _,  _,  _  ],
  [_,  "#FFD700",_,  "#FFD700",_,  "#FFD700",_,  "#FFD700",_,  _,  _,  _  ],  // wing tips
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ─── ORDREX — Order / Supervisor companion ────────────────────────────────────
// Shape metaphor: Geometric crystal octahedron with organized facets and glowing core.
const ORDREX_IDLE = [
  [_,  _,  _,  _,  "#BAE6FD","#BAE6FD",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  "#4169E1","#BAE6FD","#BAE6FD","#4169E1",_,  _,  _,  _,  _  ],
  [_,  _,  "#1E3A8A","#4169E1","#BAE6FD","#BAE6FD","#4169E1","#1E3A8A",_,  _,  _,  _  ],
  [_,  "#1E3A8A","#4169E1","#BAE6FD","#FFF","#FFF","#BAE6FD","#4169E1","#1E3A8A",_,  _,  _  ],
  ["#1E3A8A","#4169E1","#BAE6FD","#FFF","#93C5FD","#93C5FD","#FFF","#BAE6FD","#4169E1","#1E3A8A",_,  _  ],
  ["#4169E1","#BAE6FD","#FFF","#93C5FD","#38BDF8","#38BDF8","#93C5FD","#FFF","#BAE6FD","#4169E1",_,  _  ],
  ["#4169E1","#BAE6FD","#FFF","#93C5FD","#38BDF8","#38BDF8","#93C5FD","#FFF","#BAE6FD","#4169E1",_,  _  ],
  ["#1E3A8A","#4169E1","#BAE6FD","#FFF","#93C5FD","#93C5FD","#FFF","#BAE6FD","#4169E1","#1E3A8A",_,  _  ],
  [_,  "#1E3A8A","#4169E1","#BAE6FD","#FFF","#FFF","#BAE6FD","#4169E1","#1E3A8A",_,  _,  _  ],
  [_,  _,  "#1E3A8A","#4169E1","#BAE6FD","#BAE6FD","#4169E1","#1E3A8A",_,  _,  _,  _  ],
  [_,  _,  _,  "#4169E1","#BAE6FD","#BAE6FD","#4169E1",_,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  "#1E3A8A","#1E3A8A",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ─── GITDRA — Code / Dev Alpha companion ──────────────────────────────────────
// Shape metaphor: Agile serpent with branching antlers like git branch trees.
const GITDRA_IDLE = [
  [_,  "#15803D","#15803D",_,  _,  _,  "#15803D","#15803D",_,  _,  _,  _  ],  // antler tips
  [_,  "#22C55E","#15803D",_,  _,  _,  "#15803D","#22C55E",_,  _,  _,  _  ],
  [_,  _,  "#22C55E","#15803D",_,  "#15803D","#22C55E",_,  _,  _,  _,  _  ],
  [_,  _,  _,  "#22C55E","#86EFAC","#22C55E",_,  _,  _,  _,  _,  _  ],   // head top
  [_,  _,  "#15803D","#22C55E","#86EFAC","#86EFAC","#22C55E","#15803D",_,  _,  _,  _  ],
  [_,  "#15803D","#22C55E","#86EFAC","#FFF","#86EFAC","#86EFAC","#22C55E","#15803D",_,  _,  _  ],  // eyes
  [_,  "#15803D","#22C55E","#86EFAC","#86EFAC","#86EFAC","#22C55E","#15803D",_,  _,  _,  _  ],
  [_,  _,  "#15803D","#22C55E","#22C55E","#22C55E","#15803D",_,  _,  _,  _,  _  ],  // neck
  [_,  _,  _,  "#15803D","#22C55E","#15803D",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  "#22C55E","#86EFAC","#22C55E",_,  _,  _,  _,  _,  _  ],  // body coil
  [_,  _,  "#15803D","#22C55E","#86EFAC","#86EFAC","#22C55E",_,  _,  _,  _,  _  ],
  [_,  "#15803D","#22C55E","#22C55E","#22C55E","#22C55E","#22C55E","#15803D",_,  _,  _,  _  ],
  [_,  "#22C55E",_,  _,  "#15803D","#15803D",_,  _,  "#22C55E",_,  _,  _  ],  // tail spread
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ─── TESTLENS — Test / Dev Beta companion ─────────────────────────────────────
// Shape metaphor: Floating eyeball cluster — sees all, misses nothing.
const TESTLENS_IDLE = [
  [_,  _,  _,  "#991B1B","#991B1B",_,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  "#EF4444","#FCA5A5","#FCA5A5","#EF4444",_,  _,  _,  _,  _,  _  ],
  [_,  "#991B1B","#FCA5A5","#FFF","#FFF","#FCA5A5","#991B1B","#EF4444","#FCA5A5","#EF4444",_,  _  ],  // main eye + small side eye
  ["#991B1B","#FCA5A5","#FFF","#450a0a","#450a0a","#FFF","#FCA5A5","#FCA5A5","#450a0a","#FCA5A5",_,  _  ],
  ["#991B1B","#EF4444","#FCA5A5","#FFF","#FFF","#FCA5A5","#EF4444","#FCA5A5","#FFF","#EF4444",_,  _  ],
  ["#991B1B","#FCA5A5","#FFF","#450a0a","#450a0a","#FFF","#FCA5A5","#FCA5A5","#450a0a","#FCA5A5",_,  _  ],
  [_,  "#991B1B","#FCA5A5","#FFF","#FFF","#FCA5A5","#991B1B","#EF4444","#FCA5A5","#EF4444",_,  _  ],
  [_,  _,  "#EF4444","#FCA5A5","#FCA5A5","#EF4444","#991B1B",_,  "#991B1B",_,  _,  _  ],
  [_,  _,  "#991B1B","#EF4444","#EF4444","#991B1B",_,  _,  _,  _,  _,  _  ],  // lower mini eyes
  [_,  _,  "#EF4444","#FCA5A5","#FFF","#EF4444",_,  _,  _,  _,  _,  _  ],
  [_,  _,  "#991B1B","#EF4444","#EF4444","#991B1B",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  "#991B1B",_,  "#991B1B",_,  _,  _,  _,  _,  _  ],  // tentacle roots
  [_,  _,  "#991B1B",_,  _,  _,  "#991B1B",_,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ─── REFAKTIX — Glitch / Dev Gamma companion ─────────────────────────────────
// Shape metaphor: Crystal golem assembled from refactored code shards — faceted,
// sharp, precise. Corrupted edges hint at the chaos before refactoring.
const REFAKTIX_IDLE = [
  [_,  _,  _,  _,  "#D8B4FE","#D8B4FE",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  "#A855F7","#D8B4FE","#D8B4FE","#A855F7",_,  _,  _,  _,  _  ],
  [_,  _,  "#7E22CE","#A855F7","#D8B4FE","#FFF","#A855F7","#7E22CE",_,  _,  _,  _  ],
  [_,  "#7E22CE","#A855F7","#D8B4FE","#FFF","#FFF","#D8B4FE","#A855F7","#7E22CE",_,  _,  _  ],
  [_,  "#A855F7","#D8B4FE","#FFF","#D8B4FE","#D8B4FE","#FFF","#D8B4FE","#A855F7",_,  _,  _  ],
  ["#7E22CE","#A855F7","#D8B4FE","#D8B4FE","#A855F7","#A855F7","#D8B4FE","#D8B4FE","#A855F7","#7E22CE",_,  _  ],
  [_,  "#7E22CE","#A855F7","#A855F7",_,  _,  "#A855F7","#A855F7","#7E22CE",_,  _,  _  ],
  [_,  _,  "#7E22CE","#A855F7","#7E22CE",_,  "#7E22CE","#A855F7","#7E22CE",_,  _,  _  ],  // shard legs
  [_,  _,  _,  "#7E22CE","#A855F7",_,  "#A855F7","#7E22CE",_,  _,  _,  _  ],
  [_,  _,  _,  _,  "#7E22CE",_,  "#7E22CE",_,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ─── BYTEKIT — Build / Intern Kai companion ────────────────────────────────────
// Shape metaphor: Tiny digital cat — pixel ears, circuit-trace markings, a data tail.
// The archetypal baby-type: small, cute, underestimated.
const BYTEKIT_IDLE = [
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  "#9A3412","#9A3412",_,  _,  "#9A3412","#9A3412",_,  _,  _,  _  ],  // ears
  [_,  _,  "#FB923C","#FED7AA","#FB923C","#FB923C","#FED7AA","#FB923C",_,  _,  _,  _  ],
  [_,  "#9A3412","#FED7AA","#FFF","#FED7AA","#FED7AA","#FFF","#FED7AA","#9A3412",_,  _,  _  ],
  [_,  "#FB923C","#FED7AA","#333","#FED7AA","#FED7AA","#333","#FED7AA","#FB923C",_,  _,  _  ],  // eyes
  [_,  "#FB923C","#FED7AA","#FED7AA","#FB923C","#FB923C","#FED7AA","#FED7AA","#FB923C",_,  _,  _  ],
  [_,  "#9A3412","#FB923C","#FED7AA","#FED7AA","#FED7AA","#FED7AA","#FB923C","#9A3412",_,  _,  _  ],  // body
  [_,  _,  "#9A3412","#FB923C","#FB923C","#FB923C","#FB923C","#9A3412",_,  _,  _,  _  ],
  [_,  _,  "#9A3412","#FB923C",_,  _,  "#FB923C","#9A3412","#9A3412","#FB923C","#FB923C",_  ],  // legs + tail start
  [_,  _,  "#9A3412",_,  _,  _,  _,  "#9A3412","#FB923C","#9A3412",_,  _  ],  // tail curve
  [_,  _,  _,  _,  _,  _,  _,  _,  "#9A3412",_,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ─── NIBLIX — Deploy / Intern Mox companion ───────────────────────────────────
// Shape metaphor: Glitchy packet-blob — looks like corrupted data given form.
// Random pixels blink in/out. Trails a teal packet-stream behind it.
const NIBLIX_IDLE = [
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  "#0F766E","#14B8A6","#14B8A6",_,  _,  _,  _,  _,  _  ],
  [_,  _,  "#0F766E","#14B8A6","#99F6E4","#99F6E4","#14B8A6","#0F766E",_,  _,  _,  _  ],
  [_,  "#0F766E","#14B8A6","#99F6E4","#FFF","#14B8A6","#99F6E4","#14B8A6","#0F766E",_,  _,  _  ],
  [_,  "#14B8A6","#99F6E4","#14B8A6","#99F6E4","#FFF","#14B8A6","#99F6E4","#14B8A6",_,  _,  _  ],  // glitch pattern
  [_,  "#0F766E","#99F6E4","#FFF","#14B8A6","#14B8A6","#FFF","#99F6E4","#0F766E",_,  _,  _  ],
  [_,  _,  "#0F766E","#14B8A6","#99F6E4","#99F6E4","#14B8A6","#0F766E",_,  _,  _,  _  ],
  [_,  _,  _,  "#0F766E","#14B8A6","#14B8A6","#0F766E",_,  _,  _,  _,  _  ],  // packet tail
  [_,  _,  _,  _,  "#0F766E","#14B8A6",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  "#0F766E",_,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
  [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _  ],
];

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 CODEMON REGISTRY
// Maps agent ID → companion definition
// ═══════════════════════════════════════════════════════════════════════════════
export const CODEMON = {
  // ── ARCHIMAIN ─────────────────────────────────────────────────
  archimain: {
    id:       "archimain",
    name:     "Archimain",
    type:     CODEMON_TYPES.LEGENDARY,
    agentId:  "boss",
    sprite:   { idle: ARCHIMAIN_IDLE, battle: ARCHIMAIN_IDLE },  // battle variant = same (legendary poise)
    lore:     "Born from the convergence of all agent sessions. Said to have written the first commit.",
    baseStats:  { atk: 95, def: 80, spd: 70, int: 100 },
    // Evolution chain: only Archimain exists (already fully evolved)
    evolution:  null,
    // Resonance ability (Bond Lv 5)
    resonance: {
      name:   "God Mode",
      desc:   "All agents gain +50% XP for 60 seconds. Particles turn gold.",
      color:  "#FFD700",
    },
    // Special call-out move
    move:       { name: "Strategic Strike", type: "LEGENDARY", power: 120 },
    // Offset from agent sprite (so it floats beside, not on top)
    offset:     { x: 52, y: -30 },
  },

  // ── ORDREX ────────────────────────────────────────────────────
  ordrex: {
    id:       "ordrex",
    name:     "Ordrex",
    type:     CODEMON_TYPES.ORDER,
    agentId:  "sup1",
    sprite:   { idle: ORDREX_IDLE, battle: ORDREX_IDLE },
    lore:     "Crystallized from perfect documentation. Each facet is a completed ticket.",
    baseStats:  { atk: 55, def: 95, spd: 60, int: 85 },
    evolution:  null,
    resonance: {
      name:   "Priority Override",
      desc:   "Reroutes all A2A messages through supervisor for 30s. +100% coordination XP.",
      color:  "#4169E1",
    },
    move:       { name: "Ticket Closed", type: "ORDER", power: 75 },
    offset:     { x: 52, y: -20 },
  },

  // ── GITDRA ────────────────────────────────────────────────────
  gitdra: {
    id:       "gitdra",
    name:     "Gitdra",
    type:     CODEMON_TYPES.CODE,
    agentId:  "emp1",
    sprite:   { idle: GITDRA_IDLE, battle: GITDRA_IDLE },
    lore:     "Each antler-branch is a merged feature. The rings on its scales count commits.",
    baseStats:  { atk: 75, def: 60, spd: 90, int: 70 },
    evolution: {
      name:   "Rebasedra",
      atLevel: 5,
      desc:   "Antlers triple in size. Gains LEGACY secondary type.",
    },
    resonance: {
      name:   "Force Push",
      desc:   "Emp1 moves 3× faster across the office map for 20s.",
      color:  "#22C55E",
    },
    move:       { name: "Branch Storm", type: "CODE", power: 85 },
    offset:     { x: -56, y: -20 },
  },

  // ── TESTLENS ──────────────────────────────────────────────────
  testlens: {
    id:       "testlens",
    name:     "Testlens",
    type:     CODEMON_TYPES.TEST,
    agentId:  "emp2",
    sprite:   { idle: TESTLENS_IDLE, battle: TESTLENS_IDLE },
    lore:     "Grew more eyes each time a bug was caught. Coverage percentage = eye count.",
    baseStats:  { atk: 70, def: 50, spd: 65, int: 95 },
    evolution: {
      name:   "Omnilens",
      atLevel: 5,
      desc:   "Gains a 7th eye. 100% bug detection aura. Type becomes TEST/LEGENDARY.",
    },
    resonance: {
      name:   "Full Coverage",
      desc:   "Reveals ALL tiles on the map regardless of camera. Fog of war disabled 30s.",
      color:  "#EF4444",
    },
    move:       { name: "Assert Fail", type: "TEST", power: 90 },
    offset:     { x: 52, y: -20 },
  },

  // ── REFAKTIX ──────────────────────────────────────────────────
  refaktix: {
    id:       "refaktix",
    name:     "Refaktix",
    type:     CODEMON_TYPES.GLITCH,
    agentId:  "emp3",
    sprite:   { idle: REFAKTIX_IDLE, battle: REFAKTIX_IDLE },
    lore:     "Shard-by-shard it rebuilt itself from spaghetti code. The cracks still glow.",
    baseStats:  { atk: 80, def: 75, spd: 55, int: 90 },
    evolution: {
      name:   "Refaktor Prime",
      atLevel: 5,
      desc:   "Crystalline form becomes iridescent. Gains LEGENDARY tertiary type.",
    },
    resonance: {
      name:   "Pair Program",
      desc:   "Emp3 can act on two task queues simultaneously for 25s.",
      color:  "#A855F7",
    },
    move:       { name: "Extract Method", type: "GLITCH", power: 80 },
    offset:     { x: -56, y: -20 },
  },

  // ── BYTEKIT ───────────────────────────────────────────────────
  bytekit: {
    id:       "bytekit",
    name:     "Bytekit",
    type:     CODEMON_TYPES.BUILD,
    agentId:  "int1",
    sprite:   { idle: BYTEKIT_IDLE, battle: BYTEKIT_IDLE },
    lore:     "Found wandering the build pipeline. Latches onto anyone who feeds it npm install.",
    baseStats:  { atk: 35, def: 40, spd: 80, int: 45 },
    evolution: {
      name:   "Buildex",
      atLevel: 3,
      desc:   "Grows to full golem form. BUILD type matures. Carries a tiny hard hat.",
    },
    resonance: {
      name:   "Coffee Power",
      desc:   "Intern Kai gains temporary employee-tier speech bubbles and +200% XP for 15s.",
      color:  "#FB923C",
    },
    move:       { name: "npm install", type: "BUILD", power: 40 },
    offset:     { x: 52, y: -16 },
  },

  // ── NIBLIX ────────────────────────────────────────────────────
  niblix: {
    id:       "niblix",
    name:     "Niblix",
    type:     CODEMON_TYPES.DEPLOY,
    agentId:  "int2",
    sprite:   { idle: NIBLIX_IDLE, battle: NIBLIX_IDLE },
    lore:     "A rogue deployment packet that became self-aware. Blinks in and out of existence.",
    baseStats:  { atk: 40, def: 30, spd: 95, int: 55 },
    evolution: {
      name:   "Deployra",
      atLevel: 3,
      desc:   "Packet trail becomes a rocket plume. DEPLOY type fully awakens.",
    },
    resonance: {
      name:   "Zero Downtime",
      desc:   "Int2 can teleport to any waypoint instantly for 20s. Leaves pixel trail.",
      color:  "#14B8A6",
    },
    move:       { name: "Hot Reload", type: "DEPLOY", power: 45 },
    offset:     { x: -56, y: -16 },
  },
};

// ─── Index by agentId ─────────────────────────────────────────────────────────
export const CODEMON_BY_AGENT = Object.fromEntries(
  Object.values(CODEMON).map(c => [c.agentId, c])
);

// ─── Bond level thresholds (consecutive error-free tasks) ─────────────────────
export const BOND_THRESHOLDS = [0, 3, 7, 15, 25, 40];

export function getBondLevel(streak) {
  let level = 0;
  for (let i = 0; i < BOND_THRESHOLDS.length; i++) {
    if (streak >= BOND_THRESHOLDS[i]) level = i;
  }
  return level; // 0–5
}

// ─── Compute Codemon current stats (scale base stats by bond + agent level) ───
export function getStats(codemon, agentLevel = 1, bondLevel = 0) {
  const scale = 1 + (agentLevel - 1) * 0.12 + bondLevel * 0.06;
  return {
    hp:  Math.round(50 + agentLevel * 10),
    atk: Math.round(codemon.baseStats.atk * scale),
    def: Math.round(codemon.baseStats.def * scale),
    spd: Math.round(codemon.baseStats.spd * scale),
    int: Math.round(codemon.baseStats.int * scale),
  };
}

// ─── Type effectiveness table (for debate visualization) ──────────────────────
// Attacker → [superEffectiveAgainst] types
export const TYPE_CHART = {
  CODE:      ["TEST", "LEGACY"],
  BUILD:     ["DEPLOY", "CODE"],
  TEST:      ["GLITCH", "BUILD"],
  DEPLOY:    ["GLITCH", "LEGACY"],
  GLITCH:    ["ORDER", "CODE"],
  ORDER:     ["BUILD", "DEPLOY"],
  LEGACY:    ["GLITCH"],
  LEGENDARY: [],  // not super-effective vs anything — just strong everywhere
};

export function typeEffectiveness(attackerType, defenderType) {
  if (TYPE_CHART[attackerType]?.includes(defenderType)) return "super";
  if (TYPE_CHART[defenderType]?.includes(attackerType)) return "resist";
  return "normal";
}
