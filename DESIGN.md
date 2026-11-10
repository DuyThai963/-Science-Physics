# DESIGN.md - Science - Physics Visual System & Tokens

## 1. Overview & Brand Personality
- **Aesthetic Family**: Monochrome Minimalist Utilitarian (Obsidian & Stark White)
- **Mood**: High-contrast, clean, scientific, distraction-free, stealthy night-mode.
- **Design Read Formula**:
  `[Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)`

## 2. Color Palette & Semantic Roles (Monochrome Palette)
- `canvas`: `#09090b` (Deep obsidian / pitch black base)
- `surface`: `#121215` (Dark graphite card background)
- `surface-elevated`: `#18181b` (Zinc-900 elevated panels & dropdowns)
- `surface-highlight`: `#27272a` (Zinc-800 hover states)
- `border-subtle`: `#27272a` (Zinc-800 crisp 1px hairline separation)
- `border-strong`: `#3f3f46` (Zinc-700 active borders & input focus)
- `foreground-primary`: `#f4f4f5` (Zinc-100 high contrast text)
- `foreground-secondary`: `#a1a1aa` (Zinc-400 metadata & secondary labels)
- `foreground-muted`: `#71717a` (Zinc-500 muted text)
- `accent`: `#ffffff` (Pure white high-contrast active state)
- `accent-hover`: `#e4e4e7` (Zinc-200)

## 3. Typography Hierarchy
- **Font Families**: Inter (system-ui) & JetBrains Mono (monospace labels & codes)
- **Scale**:
  - `Hero Title`: `text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white`
  - `Section Header`: `text-base sm:text-lg font-bold font-mono tracking-tight text-white`
  - `Document Title`: `text-xs sm:text-sm font-medium line-clamp-2`
  - `Code / Meta`: `text-[10px] sm:text-[11px] font-mono tracking-wider`

## 4. Spacing & Rhythm
- Clean 4px / 8px scale.
- Consistent border radii (`rounded-lg` for buttons/inputs, `rounded-xl` for cards/modals).
- No gratuitous colors or gradients.
