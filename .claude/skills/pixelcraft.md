# /pixelcraft — PixelHQ ULTRA Visual Design System

You are now operating under the **PixelHQ ULTRA Pixel Craft** style system.
Every visual component you generate must strictly conform to this specification.

---

## 🎨 AESTHETIC IDENTITY

**Style**: Retro-Modern Pixel Art × Pokémon-Hybrid
- **NOT** Pokémon IP — original creature designs inspired by the *feeling*:
  silhouette-first design, distinct type/color identity, stat cards, companion bonding
- **NOT** retro only — dark GitHub-style dark UI frames it all in 2025 terminal aesthetics
- The pixel grid is gospel. Every element snaps to the grid.

---

## 📐 GRID SYSTEM

| Tier       | Grid      | Render px/cell | Use for                     |
|------------|-----------|----------------|-----------------------------|
| MICRO      | 4 × 6     | 3px            | Status icons, dots          |
| SMALL      | 7 × 9     | 4px            | Agent sprites (humans)      |
| MEDIUM     | 12 × 16   | 4px            | Codemon companion creatures |
| LARGE      | 20 × 24   | 3px            | Evolution cutscene          |
| PANORAMIC  | tile map  | 32px/tile      | Office world                |

**Rule**: sprite arrays are 2D arrays of hex color strings or `0` (transparent).
```js
// MEDIUM creature sprite example:
const rows = [
  [0,   0,   "#FFD700", "#FFD700", 0,   0  ],
  ["#B8860B", "#FFD700", "#FFF", "#FFF", "#FFD700", "#B8860B"],
  // ...
];
```
Render each cell as a `<div>` with `width/height = scale` px, `background = color || "transparent"`.

---

## 🖌️ MASTER COLOR PALETTE

### Environment
```
BG Deep:        #040408   Void/empty tiles
BG Base:        #0d1117   Main dark (GitHub dark)
BG Surface:     #161b22   Cards, panels
BG Elevated:    #21262d   Borders, dividers
BG Active:      #30363d   Hover states
Text Primary:   #e6edf3
Text Secondary: #8b949e
Text Muted:     #484f58
```

### Neon Accent Layer (retro-modern glow)
```
Neon Green:     #7ee787   Working/active state
Neon Blue:      #58a6ff   Walking/info
Neon Purple:    #d2a8ff   Evolution/magic
Neon Amber:     #ffa657   Warning/meeting
Neon Red:       #f85149   Error/debate
Neon Teal:      #39d353   Success
Neon Gold:      #FFD700   Boss/legendary
```

### Codemon Type Colors
```
TYPE_CODE:      #22C55E / #15803D   (serpentine, branch-antler creatures)
TYPE_BUILD:     #FB923C / #9A3412   (golem, heavy, compiling)
TYPE_TEST:      #EF4444 / #991B1B   (many-eyed, sight-based)
TYPE_DEPLOY:    #38BDF8 / #0369A1   (rocket, speed creatures)
TYPE_GLITCH:    #A855F7 / #7E22CE   (corrupted, unstable, powerful)
TYPE_ORDER:     #4169E1 / #1E3A8A   (geometric, crystalline)
TYPE_LEGACY:    #78716C / #44403C   (ancient, dusty, slow but wise)
TYPE_LEGENDARY: #FFD700 / #B8860B   (boss companion, radiant)
```

---

## 🐾 CODEMON DESIGN PRINCIPLES

Codemon are **original digital creatures** that live in the PixelHQ office alongside agents.
They are NOT pets — they are **companions** that externalize and amplify an agent's abilities.

### Design Rules
1. **Silhouette first** — the creature must be recognizable at 12×16 pixels
2. **One dominant shape** — snake? cube? eye cluster? blob? pick ONE
3. **3-color max** (highlight, base, shadow) + transparent
4. **Type determines body language** — CODE types are agile/long; BUILD types are blocky; TEST types have eyes
5. **Baby → Adult → Mega** evolution path, unlocked by agent XP milestones

### Companion Bond System
- Each agent has exactly ONE Codemon companion
- The Codemon's **HP** = percentage of agent XP bar filled
- The Codemon's **LV** = agent's level
- **Bond Level** (1-5) = how many consecutive tasks the agent completed without errors
- At Bond 5: Codemon enters **Resonance Mode** — glows, gets aura animation, buffs the agent

### Codemon Stat Card Layout
```
╔══════════════════════════════╗
║ [sprite 48×64]  NAME  Lv.XX ║
║                 TYPE badge   ║
║ HP ████████░░  72/100        ║
║ ATK ██████░░░  str=attacks   ║
║ DEF ████░░░░░  resilience    ║
║ SPD ████████░  velocity      ║
║ BOND ★★★★☆                  ║
╚══════════════════════════════╝
```

---

## ✨ ANIMATION LIBRARY

All animations use CSS keyframes. Always include this `<style>` block:

```css
/* PIXEL CRAFT ANIMATION LIBRARY */
@keyframes pixelBob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes pixelWalk  { 0%{transform:translateX(-2px) scaleX(1)} 100%{transform:translateX(2px) scaleX(1)} }
@keyframes pixelShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
@keyframes breathe    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
@keyframes auraGlow   {
  0%   { box-shadow: 0 0 4px var(--aura), 0 0 8px var(--aura); }
  50%  { box-shadow: 0 0 12px var(--aura), 0 0 24px var(--aura), 0 0 40px var(--aura); }
  100% { box-shadow: 0 0 4px var(--aura), 0 0 8px var(--aura); }
}
@keyframes typeReveal { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:none} }
@keyframes statBar    { from{width:0} to{width:var(--pct)} }
@keyframes floatUp    {
  0%   { transform:translateY(0) rotate(0deg); opacity:1; }
  100% { transform:translateY(-40px) rotate(10deg); opacity:0; }
}
@keyframes slidePanel {
  from { transform:translateX(100%); opacity:0; }
  to   { transform:translateX(0);    opacity:1; }
}
@keyframes scanlines {
  0%   { background-position: 0 0; }
  100% { background-position: 0 4px; }
}
@keyframes glitchShift {
  0%,90%,100% { transform:translateX(0); filter:none; }
  91%  { transform:translateX(-3px); filter:hue-rotate(90deg); }
  93%  { transform:translateX(3px);  filter:hue-rotate(-90deg); }
  95%  { transform:translateX(0);    filter:brightness(1.5); }
}
@keyframes levelUp {
  0%   { transform:scale(1)    filter:brightness(1); }
  50%  { transform:scale(1.15) filter:brightness(2) saturate(2); }
  100% { transform:scale(1)    filter:brightness(1); }
}
@keyframes battleSlideIn {
  from { transform:translateX(60px) scale(0.8); opacity:0; }
  to   { transform:translateX(0)    scale(1);   opacity:1; }
}
@keyframes hpDrain {
  from { width: var(--from-pct); }
  to   { width: var(--to-pct); }
}
@keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes ripple  {
  0%   { transform:scale(0.8); opacity:0.8; }
  100% { transform:scale(2.5); opacity:0; }
}
```

### Animation Assignment by State
| Agent State | Animation         | Duration  |
|-------------|-------------------|-----------|
| idle        | `pixelBob`        | 1.4s ease-in-out infinite |
| walking     | `pixelWalk`       | 0.35s steps(2) infinite |
| working     | `breathe`         | 1.0s ease-in-out infinite |
| meeting     | none              | — |
| error       | `pixelShake`      | 0.15s ease infinite |
| resonance   | `auraGlow`        | 2s ease-in-out infinite |
| glitch      | `glitchShift`     | 0.4s steps(1) infinite |
| levelup     | `levelUp`         | 0.6s ease |

---

## 🖥️ UI COMPONENT TEMPLATES

### Retro Panel Container
```jsx
<div style={{
  background: "#0d1117",
  border: "1px solid #21262d",
  borderRadius: 8,
  padding: 12,
  fontFamily: "'JetBrains Mono', monospace",
  boxShadow: "inset 0 0 40px rgba(0,0,0,0.4)",
  position: "relative",
  overflow: "hidden",
}}>
  {/* Scanline overlay */}
  <div style={{
    position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
    background:"repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.06) 1px,rgba(0,0,0,0.06) 2px)",
  }}/>
  {/* content */}
</div>
```

### Neon Badge
```jsx
<div style={{
  padding:"2px 8px", borderRadius:4,
  background: `${typeColor}22`,
  border: `1px solid ${typeColor}55`,
  color: typeColor,
  fontSize:9, fontWeight:700, letterSpacing:"0.5px",
  textTransform:"uppercase",
  boxShadow: `0 0 8px ${typeColor}33`,
}}>
  {label}
</div>
```

### Stat Bar
```jsx
<div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
  <div style={{ width:28, fontSize:8, color:"#8b949e" }}>{label}</div>
  <div style={{ flex:1, height:5, background:"#21262d", borderRadius:3, overflow:"hidden" }}>
    <div style={{
      height:"100%", borderRadius:3,
      width:`${pct}%`,
      background:`linear-gradient(90deg, ${color}aa, ${color})`,
      animation:`statBar 0.8s ease forwards`,
      boxShadow:`0 0 6px ${color}88`,
    }}/>
  </div>
  <div style={{ fontSize:8, color:"#e6edf3", width:28, textAlign:"right" }}>{val}</div>
</div>
```

### Typewriter Text (hook pattern)
```jsx
function useTypewriter(text, speed = 28) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    setShown("");
    const t = setInterval(() => {
      i++; setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return shown;
}
```

---

## 🌍 ENVIRONMENT RULES

### Office Zones — Visual Personality
| Zone          | Floor tint              | Ambient glow          | Vibe              |
|---------------|-------------------------|-----------------------|-------------------|
| Boss Office   | Deep navy carpet        | Gold/amber            | Executive power   |
| Open Workspace| Neutral dark tile       | Soft green (active)   | Productive hum    |
| Meeting Room  | Purple carpet           | Warm amber            | Collaboration     |
| Server Room   | Dark green tile         | Cyan rack lights      | Data flow         |
| Break Room    | Warm charcoal           | Coffee orange         | Recharge          |
| Hallways      | Dark corridor           | Blue directional LEDs | Transit           |

### Camera / Fog of War
- Camera smoothly follows boss agent (or selected agent)
- Revealed tiles: full brightness
- Adjacent unrevealed: `brightness(0.15)` with `transition: filter 0.8s ease`
- New zone entry: brief `ripple` pulse at center of new zone

### Particle Effects
- A2A messages: bezier-arc, emoji icon, scale pulse mid-arc
- Level-up: starburst + `floatUp` "+XP" text
- Evolution: `levelUp` keyframe + white flash + new sprite swap
- Codemon bond reach 5: `auraGlow` + ripple rings expand from creature

---

## 📝 GENERATION INSTRUCTIONS

When generating new sprites, components, or creatures using this skill:

1. **Always declare palette constants first** — never hardcode hex mid-component
2. **Name every animation** — no anonymous `style={{ animation: "..." }}` without a comment
3. **Creature sprites**: define as named const arrays, NOT inline
4. **Type the component's props** with JSDoc comment
5. **Layer order**: tiles → furniture → agents → Codemon → particles → bubbles → overlays → HUD
6. **Touch nothing** outside the explicitly requested component — no global refactors

### New Codemon Recipe
1. Pick a **type** from the type table above
2. Choose a **dominant shape metaphor** (1 sentence: e.g. "branching serpent with git-antlers")
3. Define a **3-color palette**: highlight, base, shadow from type colors
4. Draw the **12×16 grid** — silhouette first, then color
5. Write **idle** and **battle** variants (battle: leaning forward, more aggressive)
6. Define base **stats** (ATK/DEF/SPD 1-100) fitting the type fantasy
7. Name: portmanteau of tech concept + creature archetype (Gitdra, Testlens, Bytekit...)
8. Write the **evolution chain**: Baby (7×9) → Adult (12×16) → Mega (20×24)

---

*This skill was generated by PixelHQ ULTRA. Invoke it with `/pixelcraft` to enforce
the full retro-modern pixel aesthetic on any component you generate.*
