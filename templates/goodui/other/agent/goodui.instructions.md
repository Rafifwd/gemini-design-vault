---
applyTo: "**/*.tsx"
---

# goodui

goodui is a shadcn/ui kit: layered Core components (one component, many combinable props), animated components and full application blocks. Files install into `components/goodui/<id>.tsx` and are the project's own code.

## Workflow

1. Find: pick a component or block for each part of the screen (catalog below, the goodui MCP server's `search_components`, or https://goodui.dev/llms.txt).
2. Read: open its docs (https://goodui.dev/components/<group>/<id>.md or MCP `get_component`). Use only documented props; read "Notes for AI".
3. Install: `npx shadcn@latest add https://goodui.dev/r/<id>.json` (or `@goodui/<id>` when the registry is in components.json). Pro blocks: `@goodui-pro/<id>` with GOODUI_LICENSE_KEY.
4. Compose: import from `@/components/goodui/<id>`; pass props, don't restyle internals.
5. Review against the checklist at the end.

## Quick decisions

| The person wants | Use | Not |
| --- | --- | --- |
| Any button | `button` with variant, tone, size, animation | Custom Tailwind button classes |
| A status label or count | `badge` | A styled span |
| A content box or KPI tile | `card`, `stat-card` | Hand-made divs with borders |
| A text field | `input` (labels, addons, clear, count, validation) | A bare <input> |
| Pick one or many from a list | `select` | A native <select> in an app UI |
| A setting on/off | `switch` | A checkbox for instant settings |
| Section titles and body copy | `heading`, `text` | Ad-hoc font sizes |
| A number that changes | `number-flow`, `counter-up` | Text that jumps |
| Feedback after an action | `toast-stack` | alert() or a custom popup |
| Views of the same data | `tabs` or `segmented-control` | Separate pages |
| A destructive confirm | `hold-to-confirm` or a dialog | A plain red button |
| Booking or scheduling | the scheduling blocks (booking-wizard, slot-picker, resource-timeline…) | Building a calendar from scratch |

## Rules

1. Colors come from the theme: shadcn tokens (bg-background, text-muted-foreground, border, ring, var(--chart-1..5)) and the `tone` prop (primary, neutral, success, warning, danger, info). Never hard-code colors like bg-red-500 for meaning.
2. One looping animation (shimmer, pulse) per screen; entrance and hover motion is fine everywhere. Every component already respects prefers-reduced-motion; don't add motion that ignores it.
3. Built-in text (aria labels, screen-reader messages) is translated once for the whole app: install `npx shadcn@latest add https://goodui.dev/r/locale-<lang>.json` (tr, de, fr, es, it, pt-BR, nl, pl, ru, hi, id, vi, th, ja, ko, zh-CN, ar, he) and mount `<GooduiLocaleProvider lang="tr" labels={tr}>` from lib/goodui-locale at the root; Intl number and date formats follow `lang`. Set `<html lang dir>` yourself (ar and he are RTL). A single string is overridden per instance with the `labels` prop. goodui Native: the same packs from `https://goodui.dev/native/r/locale-<lang>.json`, with `<GooduiLocaleProvider>` from components/goodui-native/foundation around ThemeProvider.
4. Layout uses logical properties (ms/me, ps/pe, start/end) so dir="rtl" works.
5. Real elements: buttons are <button>, links are <a> (or the `link` component). Icon-only buttons need aria-label.
6. Style packs: data-style="brutal|glass|retro98|pixel|terminal|editorial|soft|neon|paper|swiss|luxe" on <html> restyles everything (goodui Native: the same names on ThemeProvider's `look` prop); don't fight it with per-component overrides.
7. UI sounds are optional and off by default: button, switch, checkbox, tabs, rating, number-input, dialog, toast-stack (Toaster), confetti, hold-to-confirm, copy-button and stateful-button take `sound` (true, or a name such as "success"). They need `npx shadcn@latest add https://goodui.dev/r/sounds.json` (lib/goodui-sounds: play(), useSound(), <SoundProvider>, data-sound attributes) and a visible toggle for the visitor. Never autoplay or add audio files; in goodui Native the same names are haptic patterns.

8. Type: the kit's pairing is goodui Sans for text (--font-sans) and goodui Display for headings (--font-heading; h1–h3 and the `font-heading` class on card, dialog and sheet titles). Both are OFL and ship in public/fonts/goodui with a next/font/local setup (https://goodui.dev/fonts). Don't add Inter, Geist or Google Fonts imports to a screen; change the pairing in the Theme Studio instead.

## Review checklist

- [ ] Every interactive element is a goodui or shadcn component, used with documented props only.
- [ ] No hard-coded colors; tones and tokens only. Works in light and dark (.dark on <html>).
- [ ] At most one looping animation on the screen.
- [ ] Icon-only controls have aria-label; non-English apps mount GooduiLocaleProvider with a language pack.
- [ ] No horizontal overflow at 390px wide.

## Components (free, MIT)

### Core UI
- `button`: One button with ten variants, six tones, seven shadows, ten animations, three shapes and five sizes that all combine, plus loading and icon slots.
- `badge`: One badge, every layer: solid, soft, outline, status dot, gradient, glass and neo in six tones, with pulse, shine, bounce-in and count-pop animations, icons, removable chips and clickable filters.
- `card`: Eight surfaces (elevated, glass, gradient border, neo, inset…) with shadow, padding, radius and accent stripes, plus hover layers (lift, 3D tilt, pointer spotlight, glow, scale) and a looping border beam.
- `input`: Six field styles with top, floating, inline or hidden labels, focus ring, glow, underline-grow or lift, error shake with sliding messages, icon and text addons, clear button, counter and auto-growing textarea.
- `avatar`: Six sizes and four shapes including squircle, status dots with pulse, solid, gradient and rotating story rings, image fade-in with name-based gradient initials, and groups that cap with +N and fan out on hover.
- `alert`: Soft, solid, outline, left-accent, glass, neo and full-width banner alerts with tone-picked icons, actions, slide, fade, shake or pop entrances, smooth collapse on dismiss and a pausable auto-dismiss countdown.
- `tabs`: Six variants (underline, pill, segmented, enclosed folder tabs, soft, vertical line), a sliding, fading or static indicator, fade or directional slide panels, tones, sizes, shapes, shadows and orientation, with icons, count badges, arrow keys and a one-line items API.
- `switch`: iOS, Material 3, square, neo-brutalist, icon thumb and ON/OFF label variants with none, smooth, spring and bounce motion, six tones, three sizes, track shadows, sun/moon or check/x glyphs, label and description on either side, and a loading state.
- `checkbox`: Checkbox and RadioGroup on real inputs with default, filled, outline, circle, neo and whole-card variants, draw, pop and bounce animations, tones, sizes, shadows, indeterminate, invalid and descriptions.
- `separator`: Line, dashed, dotted, gradient, double, glow and ornament separators with diamond, dot or icon marks, labels at the center, start or end, tones, thickness, vertical orientation, a draw-in-on-view and a shimmer animation.
- `breadcrumb`: Slash, chevron, dot, pill, arrow-step and underline trails with four current-page styles, tones, sizes, a staggered fade or sliding hover underline, and long trails that collapse into a keyboard-friendly menu.
- `pagination`: Outline, soft, ghost, pill, neo, minimal and carousel-dot pagination with a sliding active marker or press feedback, tones, sizes and shapes, plus first/last, range info, page-size select and jump-to-page.
- `heading`: Layered heading: semantic level and size decoupled, sans/serif/mono/display font slots you map to your own fonts, eight ink treatments (gradient, muted tail, outline, marker highlight, hand-drawn squiggle, shimmer…), serif-italic emphasis via _words_, and on-view word, letter and mask reveals.
- `text`: Every body-copy role in one primitive: paragraph, lead, small, caption, overline, eyebrow pill, quote with attribution and inline code, with tones, readable measures, truncate or line clamp, and on-view entrances.
- `link`: Inline link with seven underline styles (static, slide-in, grow from center, marker sweep, nudging arrow), line decorations, tones, leading icons and automatic external-link handling. Works with next/link via as.
- `kbd`: Keyboard keys and combos in flat, raised 3D, outline, glass, neo and solid styles. Keycaps depress when the real keys are pressed, Mod maps to ⌘ or Ctrl, and onTrigger turns any combo or G-then-T sequence into a working hotkey.
- `stat-card`: KPI card with seven variants, tones, shadows and sizes: count-up or rolling NumberFlow values, auto-toned delta badges (invertible for no-show rates), line, area or bar sparklines that draw in, icons, footers and a skeleton state.
- `select`: Fully custom single or multi select: outline, filled, ghost, underline, pill and neo triggers; icons, avatars, descriptions and groups; search with match highlight, chips, clear, type-ahead and full keyboard; animated menu that flips up when space runs out.
- `dialog`: Modal dialog, alert dialog and sheet in one: default, soft, glass and neo surfaces in six tones; center, top, start/end/left/right and draggable bottom sheets, fullscreen, and a phone override to fullscreen or sheet; scale, slide, blur, fade or morph-from-trigger entrances; async confirm with spinner and inline error, type-to-confirm, nested dialogs that step back, focus trap and restore, and scroll lock without layout shift.
- `tooltip`: Dark, light, tone, glass and neo tooltips with sizes, shapes, shadows and an optional arrow; twelve placements that flip and shift at the screen edge, scale, fade, slide or spring entrances, rich title + keyboard-shortcut content, delay groups that open instantly after the first, follow-cursor for charts and touch long-press.
- `popover`: Anchored popover with an arrow in default, soft, glass, neo and inverted surfaces, tones, sizes, radii and shadows; side and align that flip and shift to stay on screen, match-trigger-width, scale, fade, slide or spring entrances, header, close button and footer slots, and modal (focus trapped) or non-modal (Tab flows back to the page) behavior, shown as a date filter, share menu, switcher and inline note form.
- `dropdown-menu`: Menu button and right-click context menu with default, glass, neo, inverted and flat surfaces, soft, solid, bar or outline highlights, tones, sizes, shapes and shadows; icons, descriptions, badges and live keyboard shortcuts, checkbox items, radio groups, labelled groups, destructive items and nested sub-menus with hover intent and a safe triangle; scale, fade, slide or stagger entrances, type-ahead and full APG keyboard, portaled and flipped to stay on screen.
- `combobox`: Autocomplete combobox (ARIA 1.2) with outline, filled, ghost, underline, pill and neo fields, tones, sizes and shadows; local ranked matching or debounced async search with abort, cache, loading, empty and error-with-retry states, every matched word highlighted, groups, avatars, single or multi-select chips, an “Add …” create row and automatic virtualization for 10,000+ rows, in a portaled list that flips above the field.
- `date-picker`: Date picker and calendar with no date library: single, range (two months side by side) and multiple modes, presets, time inputs, min/max, disabled weekdays, booked days, ISO week numbers, month/year quick switch, typed dates parsed in the locale's order via Intl with the locale's first weekday, popover or inline, six field variants, tones, solid/soft/ring selection, day shapes, sizes and slide, fade or scale month animations with APG grid keyboard.
- `multi-step-form`: Wizard with numbered, progress-bar or vertical step headers, sync and async per-step validation that blocks Continue and focuses the first invalid field, optional steps with Skip, an auto review step with Edit links, async submit with loading, error retry and success, draft persistence, direction-aware slide or fade transitions and screen-reader step announcements, in card, outline, plain, glass and neo shells with tones and sizes.
- `number-input`: Numeric spinbutton with split, end or stacked steppers, press-and-hold acceleration, min/max/step and large steps, Intl currency, percent and unit formatting over a raw value, arrow, PageUp/PageDown, Home/End and focused-wheel stepping, slide or pop step feedback and an invalid state, in the six input variants with tones, sizes, shapes and shadows.
- `rating`: Star, heart, circle, bolt, diamond or custom-icon rating in solid, soft, outline, glow and neo styles: half steps, hover preview, clear, animated clip fill with pop or wave, value, count and word labels, read-only exact averages, RTL fill and arrow flipping, with radiogroup or slider semantics.
- `toggle-group`: Single (radiogroup) or multiple (aria-pressed) toggle buttons in outline, soft, solid, segmented, neo and glass styles with a sliding, fading or popping active marker, text or icon items, tones, sizes, shapes, shadows, attached or spaced, vertical, full width, disabled items and roving arrow-key focus that flips in RTL.
- `table`: Lined, striped, bordered, card-row and minimal tables with tones, three densities, shadows and corner shapes, tint, accent-bar or lift hover, row state tones and selection, sortable headers with aria-sort, sticky header, caption, footer totals, skeleton and empty states, fade or stagger entrances, and rows that stack into labelled cards on small containers.
- `data-grid`: Virtualized data grid for 100k+ rows with typed columns (number, currency, percent, date, boolean, badge, avatar, actions) formatted by Intl, multi-sort, per-column filters and global search, resize, drag reorder, pin, hide, Shift-range selection with a bulk action bar, inline editing with sync or async validation, spreadsheet keyboard navigation, expandable rows, footer aggregates, CSV and real .xlsx export, loading, empty and error states, server mode with pagination, RTL and tones, densities and variants.

### Numbers & Data
- `number-flow`: Digits roll to the new value with locale formatting, prefixes and suffixes.
- `counter-up`: Counts from 0 (or from) to the value with an ease-out curve when it scrolls into view, with locale formatting, once or replay-on-return, and counts from the current value when it changes.
- `meter`: Labeled usage meter like "SMS credits 7,420 / 10,000" whose fill springs to the new value and shifts to amber and rose near the limit, with optional per-seat segments.
- `progress`: Linear progress in four variants: spring-filled determinate, indeterminate double sweep, moving stripes and segmented steps.
- `circular-progress`: SVG ring or 270° gauge whose arc springs to the value via stroke-dashoffset, with a rolling percentage or custom label in the center.
- `sparkline-draw`: Smooth monotone sparkline that draws itself in, fades in a gradient area, shows point values on hover or arrow keys, and redraws when the data changes.
- `delta-badge`: "+12.4%" change badge whose digits roll, arrow rotates to the new direction and background pulses green or red, with an inverted mode for metrics where down is good.
- `cell-flash`: Wraps a table value and briefly flashes it green when it rises, red when it falls, with a fading ▲/▼, like a trading terminal.

### Feedback
- `toast-stack`: Self-contained toaster with toast() API: cards stack and expand on hover, swipe away with a drag, morph from loading to success or error for promises, and pause their timers on hover.
- `notification-badge`: Count badge for icon buttons that springs in, bumps when the count rises, rolls its digits, caps at 99+ and offers a pulse ring or dot variant.
- `skeleton-auto`: SkeletonSwap traces its children's text lines, controls and avatars (<img> or data-skeleton elements) into shimmer blocks with one shared sweep, then cross-fades to the real content; includes line, circle and block primitives.
- `spinners`: Six CSS-only loaders (ring, dots, bars, pulse, orbit, typing) sized in px or presets and painted with currentColor.
- `multi-step-loader`: Card or overlay that ticks through steps like "Reserving slot…" with spinners, drawn checkmarks and a filling rail, ending on an animated success state.
- `confetti`: Hand-written canvas 2D confetti with flipping paper physics, fired over the page from an element or inside a contained canvas via ref, and a no-op under reduced motion.
- `success-check`: Check or X in a circle that draws its stroke, fills, then pops with a ray-and-ring burst, for payment and booking result screens.

### Navigation
- `tabs-indicator`: Tabs whose indicator glides between tabs on a shared-layout spring (underline with hover highlight, pill, or segmented with icons), with arrow-key navigation and panels that slide in the direction of travel while the height eases to fit.
- `segmented-control`: iOS-style segmented control whose thumb springs to the chosen segment and squeezes while pressed, with sizes, icons, full-width mode, dividers that hide next to the thumb, and radio-group arrow keys.
- `stepper`: Horizontal or vertical stepper where the connecting line fills between steps, numbers morph into drawn checkmarks, a current-step ring glides to the active step, errors shake, and completed steps are clickable.
- `dock`: macOS-style dock whose tiles magnify on a spring as the pointer nears, with tooltips, running dots, badges and a launch bounce, falling back to a simple press scale on touch.
- `bottom-nav`: Mobile bottom bar where a pill glides to the selected tab and its icon bounces, in a labelled or expanding variant, with popping badges and an optional raised center action.
- `command-palette-morph`: A search field morphs into a command palette through a shared layout animation, with fuzzy matching, highlighted letters, grouped results, a sliding selection, arrow keys, Enter, Esc and Ctrl/Cmd+K.

### Overlays
- `morphing-dialog`: A service card expands into a booking dialog, with its image, title and price flying into place through a shared-layout spring, then folds back into the card on Esc or backdrop click.
- `drawer-spring`: A bottom sheet with half and full snap points plus side drawers on a spring; drag the handle and the release speed picks the snap point or closes it, while the backdrop fades with the drag.
- `popover-morph`: A small button such as "Add note" morphs into a floating form panel, its label sliding into the header, and shrinks back into the button on save, Esc or an outside click.
- `tooltip-animated`: A tooltip springs out of the trigger's side and can lean toward the pointer over avatars; tooltips in a delay group open instantly once one is already showing.
- `dropdown-stagger`: A dropdown menu springs open while its items stagger in, with a highlight that glides between items, submenus, checkbox and radio items, and full keyboard navigation.

### Lists & Tables
- `accordion-height`: Accordion whose panels spring open to their real height (motion height:auto) with a rotating chevron, in single or multiple mode, with arrow-key, Home and End navigation between headers.
- `list-reorder`: Drag-to-reorder list with a grip handle, a lifted shadow on the dragged row, neighbours that spring into place, and Alt+Arrow keyboard moves announced to screen readers.
- `table-row-presence`: Data table where new rows grow in with a brief highlight, removed rows slide out and collapse, and re-sorting glides every row to its new position.
- `animated-list`: Notification stack where new items spring in from the top, older ones glide down, slightly dimmed in the depth variant, and items beyond the limit blur away.
- `tree-expand`: File or category tree with spring expand/collapse, indentation guides, a selection highlight that glides between rows, and full arrow-key, Enter and type-ahead navigation.
- `expandable-row-list`: Appointment rows that open inline into a raised card with notes and working actions, while neighbouring rows smoothly make room.

### Inputs
- `tag-input`: Chips input where Enter, comma or paste adds tags that spring in, Backspace arms then removes, duplicates shake, with a filtered suggestions dropdown, validation and a max count.
- `otp-input`: One-time code input from plain inputs with auto-advance, paste and SMS autofill, a blinking caret and popping digits, then a pulsing verify, green success bounce or red shake.
- `floating-label-input`: Input and textarea whose label springs up on focus or value, with prefix/suffix slots that fade in, an animated clear button, character counter and a slide-in error.
- `vanish-input`: Search field with rotating, blurred-in placeholder hints; on submit the typed text dissolves into drifting particles drawn on a canvas.
- `input-shake`: Validation wrapper for any input that shakes and slides in an error with an icon when invalid, and draws a check circle when valid.
- `switch-spring`: Switch with a springy thumb that squashes while pressed, icons that spin inside the thumb, three sizes, label and description.
- `checkbox-draw`: Checkbox whose check stroke draws itself in over a popping fill, with an indeterminate dash and an animated strike-through for checklists.
- `slider-tooltip`: Single or range slider built from scratch with pointer and keyboard control, step snapping, marks and a value bubble that scales in while dragging.
- `search-expand`: Search icon that springs open into a field with a recent-searches dropdown and a / shortcut; Esc or blur folds it back when empty.
- `file-drop-pulse`: Drag-and-drop zone whose border pulses while files hover, then lists files with type icons, springy progress bars, size and type errors, and undo on remove.

### Buttons
- `shimmer-button`: A light sweep runs across the button. Pure CSS; the sweep is removed for reduced motion.
- `ripple-button`: Material-style ink ripple that grows from the exact press point and fades on release, pure CSS, across five variants and icon buttons.
- `rainbow-button`: Button with a seamlessly flowing rainbow border and a soft colored glow underneath, tuned to invert cleanly between light and dark themes.
- `border-beam-button`: A short light beam rides around the button's rounded border with CSS offset-path, with a conic fallback and a static gradient for reduced motion.
- `magnetic-button`: Button and its label are pulled toward a nearby cursor with a smooth falloff and spring back on leave; off for touch and reduced motion.
- `stateful-button`: Async button that morphs idle to spinner to drawn check or shaking error, with a spring width change between labels.
- `copy-button`: Copy-to-clipboard button whose icon blurs from copy into a drawn check with a popping Copied! tooltip, plus a fallback when the Clipboard API is blocked.
- `hold-to-confirm`: Press-and-hold button for destructive actions: a fill sweeps across with the label flipping color at its edge, early release rewinds it, works with Space and Enter.
- `liquid-glass-button`: Frosted glass button and pill toolbar with backdrop blur, rim light and a specular highlight that follows the pointer, falling back to a solid tint without backdrop-filter.
- `theme-toggle`: Light/dark toggle that reveals the new theme as a circle from the click point with the View Transitions API while the sun morphs into a moon.

### Text
- `text-reveal`: Reveals a heading word by word or letter by letter with a staggered blur, fade and rise when it scrolls into view or on demand.
- `typewriter`: Types and deletes a list of phrases with a human rhythm and a caret that only blinks while idle; works as an animated input placeholder.
- `word-rotate`: Swaps words in place with a vertical slide and blur while the box springs to each word's width, so the sentence glides instead of jumping.
- `shiny-text`: A soft light band sweeps across muted text on a loop or on hover, made for badges like "New: AI receptionist". Pure CSS.
- `gradient-text`: Text filled with a slowly drifting multi-stop gradient, with Aurora, Sunset, Ocean and theme palettes tuned separately for light and dark.
- `scramble-text`: Text scrambles through random glyphs and resolves left to right on mount, on view, on hover or on demand; renders the real text on the server.
- `highlighter`: Draws a marker highlight, hand-drawn underline, circle, box or strike-through behind a phrase when it scrolls into view, in six colors.
- `text-morph`: Morphs between strings letter by letter: shared characters spring to their new positions while the rest blur in and out.
- `scroll-velocity`: Rows of large text drift in opposite directions and speed up or flip with your scroll speed and direction.

### Cards & Effects
- `spotlight-card`: A soft spotlight and a lit border follow the pointer across a card; in a group, neighboring cards' borders light up too.
- `tilt-card`: Tilts toward the pointer on a spring with a moving glare, a shifting shadow and layers that float at their own depth.
- `border-beam`: Wraps any card or input and runs a light beam around its border, matching the element's corner radius automatically.
- `glow-border`: A slowly rotating gradient arc travels around the card border with a soft glow that intensifies on hover and focus.
- `progressive-blur`: Blur that grows stronger toward the edge of a scroll container, built from stacked backdrop-filter layers; shown on a scrolling bookings list.
- `expandable-card`: A card expands in place on a spring to reveal details, such as a staff profile with bookable slots or a plan's full feature list.

### Backgrounds
- `dot-grid`: A dot or line grid background with a radial, top or edge fade and an optional glow that follows the pointer. Pure CSS.
- `flickering-grid`: A canvas grid of small squares that flicker in opacity, follows the theme color, is sharp on retina and pauses off-screen.
- `aurora`: Soft colored light drifts slowly behind a section, with light and dark palettes and only transform animations for low CPU.
- `particles`: Canvas particles drift gently, link up with fine lines and move out of the pointer's way; density scales with the area.
- `marquee`: An endless horizontal or vertical marquee with faded edges that pauses on hover, shown with customer logos, testimonials and a live bookings ticker.

### AI & agents
- `chat-message`: User, assistant and system messages with avatars, grouping, a hover actions row (copy, good/bad, retry, edit), markdown-ish rendering of lists, quotes and fenced code into CodeBlocks, and a blinking caret while the answer streams.
- `streaming-text`: Reveals an answer token by token at a steady speed with a cursor that blinks while waiting for more, stop and resume, word or character mode, and smooth catch-up when uneven SSE chunks arrive; reduced motion shows sentence chunks.
- `tool-call`: Collapsible card for an agent's tool call: name and arguments in the header, a status that morphs from spinner to drawn check or error, a live duration while running, and argument and output panes inside.
- `reasoning-block`: "Thinking 8.7s" disclosure with a live tenths timer, a shimmering label while the model reasons, the current step previewed under the header and the full step list plus notes folded inside.
- `model-picker`: Model dropdown grouped by provider with icon slots, speed and quality meters that grow in, context window and price per million tokens, a gliding highlight and full keyboard support with type-ahead.
- `chat-composer`: Prompt input with an auto-growing textarea, attachment chips from picker, paste or drop, a slash-command menu, model and mode selectors, a token ring against the context limit, Enter or Cmd+Enter to send and a Stop button while streaming.
- `citations`: Inline numbered source chips that open a spring hover card with title, domain, snippet and date, a CitedText helper that turns [1] markers into chips, and a sources list whose row lights up when its chip is hovered.
- `agent-plan`: Live checklist of an agent's plan: pending, active with a pulsing halo, drawn check, error and skipped states, nested substeps that fold away when done, and a spring progress bar with a step count.
- `token-meter`: Context window usage bar whose segments (system, history, tools, response) spring to new widths, with rolling numbers, a legend, and amber then rose tones near and over the limit.
- `voice-orb`: Breathing voice-assistant orb that swells with a level prop through a spring: idle breathing, listening rings, speaking light that churns faster, and a spinning thinking arc, all in CSS on theme colors.
- `diff-view`: Unified or split diff computed from before and after text, with old/new gutters, syntax colors, changed-character highlights inside replaced lines, and Accept or Reject per hunk that collapses the discarded lines.
- `code-block`: Syntax-colored code from a built-in tokenizer or your own tokens, with theme-derived colors, line numbers, highlighted lines, a file tab, copy with a drawn check, a wrap toggle and a staggered line entrance.
- `suggestion-chips`: Starter prompts that stagger in on springs, lift on hover and fill the composer on click, as pills, cards with hints or a scrolling row with faded edges; swapping the set replays the entrance.
- `thread-list`: Conversation sidebar with search highlighting, pinned and date groups, a selection that glides between rows, hover actions on desktop and swipe-to-reveal on touch, inline rename, delete and arrow-key navigation.
- `eval-score`: Evaluation score with a rolling number, a pass, borderline or fail badge that pops in against a threshold, a spring-filled bar and a criteria breakdown with per-criterion thresholds, as card, inline row or badge.
- `typing-indicator`: Three dots waving in turn with an "Aiko is typing" sentence for one or several names, as a chat bubble, inline or dots only, mounting and leaving on a spring; reduced motion keeps the dots still.

### Charts
- `area-chart`: Area chart that draws its line in on view, morphs between 1W / 1M / 1Y ranges, and rolls its headline value as a hairline and tooltip follow the pointer or the arrow keys.
- `line-chart`: Multi-series lines that draw in staggered, a legend that toggles series while the scale refits, a crosshair that reads every series at once, and a dashed forecast segment behind a divider.
- `bar-chart`: Grouped, stacked or horizontal bars that grow from the baseline on view and morph when data changes, with a gliding hover band, legend toggles, value labels and 2px surface gaps between segments.
- `donut-chart`: Donut or pie whose slices sweep in clockwise, re-share the ring when a legend item is toggled, push out on hover and roll the center total to the slice under the pointer.
- `radial-progress`: Activity-style concentric goal rings that fill from 12 o'clock on view, spring to new values, dim the others when one is pointed at, and roll the center percentage.
- `heatmap`: Calendar (GitHub-style) or matrix heatmap on one hue with cells that pop in column by column, a tooltip, arrow-key navigation that scrolls the calendar along, and a Less–More scale.
- `funnel-chart`: Funnel whose stage bars grow open one after another on an ordinal ramp, with drop-off chips between stages, conversion from the first stage beside each value, and arrow-key rows.
- `gauge`: Semi-circular gauge with Core-tone bands whose needle springs to the value with a small overshoot (or an arc that fills), a rolling readout and a band label pill, exposed as a meter.
- `bump-chart`: Rank-over-time lines that draw in with popping dots and names at the line ends; hovering or arrowing through periods and neighbours highlights one item and reads its change.
- `treemap`: Squarified treemap whose tinted tiles fade in largest first and spring to a new layout when values change, with labels only where they fit, a tooltip and arrow-key tiles.
- `timeline-chart`: Mini Gantt whose bars grow from their start date on view, with progress fills, milestones, group headers, day / week / month ticks, a today marker and arrow-key rows.
- `waterfall-chart`: Running totals as floating bars that step in one after another in success and danger tones, with neutral total bars, connectors, signed value labels and a tooltip with the running total.
- `kpi-trend`: KPI tile family: the number rolls in on view and on every change (NumberFlow), the delta badge pops and pulses, the sparkline draws itself (SparklineDraw), and a group lines tiles up with hairline dividers.
- `chart-legend`: Shared interactive legend: aria-pressed toggle buttons with popping square, dot, line or dashed swatches, hidden-state strike-through, optional values and a hover channel that highlights a series in its chart.

## Blocks

- `scheduler-week` (free, scheduling): Drag-and-drop week calendar with resize, drag-to-create and recurring events.
- `resource-timeline` (free, scheduling): Staff or rooms as rows on a day timeline with drag, resize, conflicts and click-to-book. FullCalendar charges $480 for this view. Here it is free.
- `slot-picker` (free, scheduling): Calendly-style date and time slot picker with availability and time zone.
- `booking-wizard` (Pro, scheduling): Service, staff, time, details and confirmation in one multi-step flow.
- `availability-editor` (Pro, scheduling): Weekly working hours with multiple ranges per day, copy to all and time zone.
- `appointments-table` (Pro, scheduling): Upcoming bookings with status, staff, filters and quick actions.
- `today-schedule` (free, scheduling): Dashboard card with the next appointments and a live progress line.
- `kpi-cards` (free, dashboard): Four metric cards with trend badges and comparison to last period.
- `revenue-chart` (Pro, dashboard): Area chart with period switcher, totals and comparison.
- `bookings-overview` (Pro, dashboard): Full dashboard page: KPIs, bookings chart, top services and staff utilization.
- `team-members` (Pro, settings): Invite teammates, change roles and manage pending invitations.
- `notification-settings` (free, settings): Per-channel notification preferences grouped by topic.
- `sidebar-layout` (Pro, app-shell): Collapsible app sidebar with workspace switcher, nav groups and user menu.
- `sign-in-split` (free, auth): Brand-forward sign-in with a live product mock, rotating testimonials, social login and polished error, reset and success states.
- `sign-up-flow` (Pro, auth): Two-step sign-up with a live password strength meter and requirements checklist, business type and team size, ending on a welcome screen.
- `otp-verify` (free, auth): 6-digit email code screen that submits by itself, shakes on a wrong code, counts down to resend and lets users change their email.
- `two-factor-setup` (Pro, auth): Guided 2FA enrollment with a QR code, copyable setup key, code check and backup codes users can copy or download.
- `magic-link` (Pro, auth): Passwordless sign-in with an animated check-your-inbox screen, one-click Gmail/Outlook buttons, resend cooldown and a password fallback.
- `setup-checklist` (free, onboarding): Getting-started card with a progress ring, expandable one-click steps, skip and undo, and a confetti finish that gets new accounts to their first booking.
- `onboarding-wizard` (Pro, onboarding): Five-step setup where every choice (name, brand color, hours, services, team) updates a live preview of the public booking page.
- `empty-states` (free, onboarding): Four illustrated empty states (no bookings, no results, offline, no access), each with a primary action that works.
- `product-tour` (Pro, onboarding): Spotlight tour of the app that highlights one element at a time, with step tooltips, keyboard controls, skip and replay.
- `data-table-pro` (Pro, tables): Customer table with search, faceted filters, sortable and hideable columns, density toggle, bulk actions with undo, expandable rows and CSV export.
- `kanban-board` (Pro, tables): Drag-and-drop sales pipeline with live stage totals, weighted forecast, inline deal creation and delete with undo.
- `editable-price-list` (Pro, tables): Spreadsheet-style price editor with keyboard navigation, highlighted unsaved cells, validation and a save/discard bar.
- `contacts-directory` (free, tables): Client directory with search, A–Z jump rail, favorites, grid and list views, and a detail sheet with editable tags and notes.
- `plan-switcher` (Pro, billing): In-app plans with monthly/yearly toggle, feature comparison and a change-plan dialog with prorated charge preview and downgrade warning.
- `usage-meters` (free, billing): Gauges for bookings, SMS credits, seats and storage that warn near the limit, forecast usage and top up through a live-priced dialog.
- `invoice-history` (Pro, billing): Invoice list with status tabs, one-click retry for failed payments, a real-looking invoice preview and HTML downloads.
- `payment-method` (Pro, billing): Saved cards as realistic credit cards, plus an add-card form with a flipping live preview, brand detection and Luhn and expiry checks.
- `notification-center` (Pro, notifications): Tabbed inbox with unread counts, inline approve/decline on booking requests, archive with undo and a quick preferences popover.
- `activity-feed` (free, notifications): Color-coded team timeline of bookings, payments, notes, status changes and uploads, with type filters and load more.
- `client-inbox` (Pro, notifications): Two-pane WhatsApp, SMS and email inbox with read receipts, quick replies and live typing replies from clients.
- `whats-new` (free, notifications): Changelog launcher with an unread badge that opens illustrated release slides and a full changelog view.
- `ai-chat` (Pro, ai): Streaming chat UI with stop, regenerate, copy, feedback, model picker and markdown with copyable code blocks.
- `ai-receptionist` (Pro, ai): AI booking assistant that shows services, stylists and open slots as tappable cards in the chat and books with a calendar invite.
- `prompt-composer` (free, ai): Rich prompt input with slash commands, file attachments, model picker, token counter and a history of sent prompts.
- `ai-insights` (Pro, ai): Revenue insights with dollar impact, confidence, sparklines and one-click Apply, Dismiss with undo, and Why explanations.
- `agent-workspace` (Pro, ai): Three-pane coding agent workspace: sessions with live status, a multi-agent thread with a self-ticking plan, expandable tool calls, thinking, approve/reject for risky commands and streaming replies, plus a syntax-colored diff viewer with file tabs, patch download and Apply.
- `agent-runs-dashboard` (Pro, ai): Monitoring for AI agents: runs, success rate, cost and token KPIs, a runs-per-hour chart, an incident callout with acknowledge and resolve, filters, and a sortable runs table whose rows expand into a trace waterfall.
- `profile-settings` (free, settings): Cover-art profile card with avatar upload, live handle availability check, time zone and locale pickers with a format preview, and a sticky unsaved-changes bar.
- `workspace-settings` (Pro, settings): Anchored section nav for general, branding, defaults and a danger zone: logo upload, live URL slug check, brand color swatches with an email preview, role defaults, transfer ownership and type-to-confirm delete.
- `security-settings` (Pro, settings): Security score ring with a live checklist, password change with a strength meter, passkeys with a simulated enrollment, 2FA with recovery codes, and active sessions with revoke and undo.
- `api-keys` (Pro, settings): Live/test key list with masked prefixes, scopes, last-used and 7-day usage bars, a create dialog with grouped scopes, reveal-once secret with copy, rotate with a 24h grace note and revoke with undo. Comes with a quick-start terminal card.
- `webhooks` (Pro, settings): Endpoint list with success-rate bars, a delivery log with status codes, latency bars and one-click retry, a grouped event picker with search, signing secret reveal/copy/rotate, pause and test events.
- `integrations-grid` (Pro, settings): Brand-colored integration cards with category chips and search, an OAuth-style consent dialog with permissions and account picker that animates to connected, and a manage menu with disconnect.
- `appearance-settings` (Pro, settings): Theme, accent, density, font and corner-radius controls that re-theme a live preview built from the real goodui Core components, including a reduce-motion switch.
- `members-roles` (Pro, settings): Invite teammates by email tags with a role picker, members list with inline role change and remove-with-undo, pending invites with resend and revoke, and a sticky permission matrix with custom roles.
- `audit-log` (Pro, settings): Filterable timeline of workspace changes grouped by day with actor, action and date-range filters, expandable before/after diffs and a real CSV export.
- `domain-settings` (Pro, settings): Custom domain setup with a connection-path diagram, DNS records table with copy buttons and a verify flow that animates through checking, failed and active states, plus TLS status.
- `import-export` (Pro, settings): Three-step CSV import wizard with drag-and-drop, auto-detected column mapping, a validation preview that highlights bad rows and a progress bar, beside an export job list with downloads.
- `localization-settings` (free, settings): Languages table with completion bars, publish and default controls, auto-translate progress, an add-language dialog and a booking-page preview that flips to RTL.
- `password-reset` (free, auth): Three-step reset flow on one card: request by email, 6-digit code with resend cooldown, then a new password with live rules, ending on an animated success.
- `sso-login` (Pro, auth): Split sign-in where the work email detects the organisation and branches to Okta, Entra or Google single sign-on, or to a password with the usual states.
- `invite-accept` (Pro, auth): Ticket-style invitation card with inviter, workspace, role and teammates, a create-account or sign-in switch, decline, and a confetti welcome.
- `device-verification` (Pro, auth): New sign-in approval with map-less location cards, device and network details, a two-digit match code, a 90-second countdown, and approved, blocked and expired outcomes.
- `consent-screen` (Pro, auth): App-to-account handshake with a verified publisher, required and optional scopes you can toggle and expand, and allow or deny outcomes with a redirect progress bar.
- `magic-link-sent` (free, auth): Check-your-inbox screen with an animated envelope, one-click mail app buttons, a resend countdown ring, inline email edit, expiry timer and a code fallback.
- `pricing-table` (Pro, billing): Three plans with a monthly/yearly toggle that rolls the prices, a highlighted gradient-border plan, a full feature matrix and an enterprise contact dialog.
- `checkout-summary` (Pro, billing): Seats, add-ons, promo codes and country-based tax that all roll into a receipt-style summary with saved cards or a new card, ending in a downloadable receipt.
- `payment-history` (Pro, billing): Invoices grouped by month with status filters, totals strip, retry for failed charges, HTML/PDF-style downloads and a refund request dialog with undo.
- `usage-alerts` (free, billing): Metered usage bars with forecast overlays and threshold markers, alert rules with channels and toggles, a new-rule dialog and a simulate-a-day button that fires alerts.
- `trial-flow` (Pro, billing): One trial banner across active, ending-soon and ended states over a mock app, with dismiss, one-time extension, data export and an upgrade dialog that ends in confetti.
- `digest-settings` (Pro, notifications): Per-channel digest builder for email, Slack and push with frequency, time, days, topics and quiet hours, mirrored in a live email, Slack message or phone notification preview.
- `analytics-overview` (Pro, dashboard): Website analytics page with a date range switch, KPI cards with sparklines, a visitors/bookings traffic chart, a live visitors ticker with traffic sources and a sortable top pages table with CSV export.
- `revenue-breakdown` (Pro, dashboard): MRR movements as a waterfall (new, expansion, contraction, churn), a clickable plan mix donut, month navigation and a churn list with a win-back email dialog and undo.
- `team-performance` (Pro, dashboard): Per-person cards with goal rings, editable goals, revenue, rating and rebook rate, plus a leaderboard that re-sorts with animated rank changes by revenue, bookings or rebook rate.
- `goals-tracker` (Pro, dashboard): OKR tree of objectives and key results with progress rings and status chips, a detail panel with rolling numbers, and a check-in dialog that updates the key result and logs the history.
- `realtime-ops` (Pro, dashboard): Live operations board: service status tiles with rolling latency, a requests-per-second bar stream, a filterable animated event stream with pause, and an incident mode that degrades a service, posts events and can be acknowledged and resolved.
- `cohort-retention` (Pro, dashboard): Retention cohort matrix with heat cells, hover tooltips, percent or client counts, a legend, and a retention curve that plots the clicked cohort against the average with a plain-English takeaway.
- `funnel-dashboard` (Pro, dashboard): Booking funnel with narrowing stage bars, step conversion and drop-off counts, a segment switch (all, mobile, desktop, ads) with rolling numbers, drop-off reasons per stage and a suggested fix.
- `activity-heatmap` (free, dashboard): GitHub-style calendar heatmap of a year of bookings with tooltips, bookings or revenue metric, 12-month or 90-day range, streak cards, best hours bars and best weekdays.
- `orders-table` (Pro, tables): Orders with status chips that filter, search, select-all and bulk fulfill with a floating action bar and undo, print packing slips, and a row drawer with items, totals, delivery and a timeline.
- `customers-table` (Pro, tables): Customer table with segment tabs (VIP, new, at risk), sortable columns, lifetime value bars, inline tags you add from a popover or remove, star ratings and saved views you can create, switch and delete.
- `inventory-table` (Pro, tables): Stock table with level bars, out-of-stock and low-stock alert cards, a needs-attention filter, inline quantity editing with − and +, expandable variants and a reorder dialog with quantities and cost.
- `files-table` (Pro, tables): File manager with list and grid views, illustrated previews per type, simulated uploads with progress bars, shared-with avatar groups, download, delete with undo and a share dialog with access levels and copy link.
- `audit-table` (Pro, tables): Dense audit log with time range, actor and action filters, JSON export, and rows that expand into a before/after diff viewer with changed fields highlighted plus IP and client details.
- `approvals-queue` (free, tables): Approval inbox for time off, refunds, discounts and schedule changes with approve, reject with a required reason, j/k/a/r keyboard navigation, a done tab and undo.
- `topbar-shell` (Pro, app-shell): App shell with a top nav, a sub-nav of pills, breadcrumbs, a page header and a ⌘K command palette that jumps to any page or action, plus notifications and an account menu.
- `command-palette-shell` (Pro, app-shell): Shell with a custom command palette (fuzzy search, groups, recent items, shortcuts, keyboard navigation) whose commands navigate, toggle dark mode and density, and open clients, with a log of what happened.
- `mobile-tabbar-shell` (Pro, app-shell): Responsive shell: sidebar on desktop, animated bottom tabs with badges on mobile, a floating action button and a bottom-sheet booking form that validates and adds to today's list.
- `page-header-actions` (free, app-shell): Page header patterns in one scrolling page: breadcrumb, avatar, inline rename, status badge, primary and overflow actions, tabs with counts, filter chips, a delete confirmation, and a sticky header that compacts on scroll.
- `split-view-shell` (Pro, app-shell): Master-detail inbox with a drag-to-resize divider that also works with the keyboard, unread and starred threads, j/k navigation, replies that post to the thread, archive with undo and a stacked mobile layout with back.
- `notifications-shell` (Pro, app-shell): Shell with a bell that wiggles and counts, per-page badges in the sidebar, a notification drawer with all/unread filter, inline accept/decline, dismiss, mark all read, do-not-disturb and a simulate button.
- `month-calendar` (Pro, scheduling): Month grid with color-coded bookings you can drag to another day (or move with arrow keys), a quick-create popover on any day, month navigation, delete and undo.
- `day-agenda` (free, scheduling): Timeline agenda with a moving current-time line, now/next cards, overlapping bookings packed into columns, and drag-to-resize that snaps to 15 minutes (Shift+arrows on the keyboard).
- `recurring-rule-editor` (Pro, scheduling): RRULE builder with presets, interval and frequency, weekday toggles, monthly by day or weekday, ends never/after/on, a plain-English summary, the next dates and a copyable iCalendar rule.
- `waitlist-manager` (free, scheduling): Waitlist with priority reordering, open slots to offer, a 15-minute countdown on each offer, simulated accept/decline, auto-release of expired offers and a next-up card.
- `class-schedule-grid` (Pro, scheduling): Weekly class timetable with capacity bars on every class, type and coach filters, a detail card with seat dots, book/cancel that updates capacity and a “your week” list.
- `timezone-planner` (Pro, scheduling): Multi-time-zone meeting planner: each person's working hours on a strip, an overlap score by hour, a draggable time pill (keyboard too), add/remove people, a home zone and copyable local times.
- `hero-product-shot` (free, marketing): Centered hero over a dot grid with a tilting, parallax product mock that goes live on click (numbers roll, chart grows, floating booking toast), avatar trust row and a trial dialog with email validation and an inbox success state.
- `hero-word-morph` (Pro, marketing): Aurora hero where industry tabs morph the headline noun letter by letter and rotate the verbs, swap the proof line and the WhatsApp booking card, with an email form that validates and lands on a success check.
- `feature-grid-reveal` (Pro, marketing): Six spotlight-linked feature cards where hover, focus or tap slides a live mini UI (slot picker, chat, receipt, utilization bars) up over the card, plus a show-all toggle for touch.
- `feature-spotlight-scroll` (Pro, marketing): Four scrolling feature stories with a sticky screen on the right that swaps as each story reaches the middle, step dots and a next button, stacking into inline panels on mobile.
- `testimonial-wall` (Pro, marketing): Masonry wall of reviews with two gradient featured cards and result pills, industry filter tabs with counts, a counting 4.9 rating header and show-more.
- `testimonial-carousel` (Pro, marketing): Autoplaying story carousel with a progress bar on the active dot, prev/next, pause, arrow keys, a rolling result number tinted per customer and a thumbnail rail to jump between stories.
- `logo-cloud-marquee` (free, marketing): Two opposing marquee rows of hand-drawn customer marks with edge fades, pause on hover, a play/pause control and tappable logos that reveal who the customer is.
- `pricing-toggle` (Pro, marketing): Three plans with a sliding monthly/yearly pill, a team-size stepper that reprices seats, rolling prices, a border-beam highlighted plan and a confirm dialog per plan.
- `pricing-comparison` (Pro, marketing): Full feature matrix with a sticky plan header, collapsible groups, an only-differences filter, info tooltips, a highlighted column you can switch and a single-column mobile view with a plan picker.
- `faq-accordion` (free, marketing): Height-animated FAQ with a sticky sidebar of topic filters with counts, search that highlights matches inside questions, expand/collapse all and an ask-a-question fallback for empty results.
- `cta-band` (Pro, marketing): Dark gradient call-to-action band with floating particles, a shiny offer pill, an email form with validation and success, and a book-a-demo card that opens a time picker dialog.
- `stats-band` (free, marketing): Four big counting statistics in a split card; hovering or focusing a stat draws its yearly sparkline and updates a live caption, with a replay button.
- `footer-mega` (Pro, marketing): Four-column site footer with a newsletter form, accordion columns on mobile, language select, a light/dark/system theme control, system status dot and social links.
- `newsletter-signup` (free, marketing): Split newsletter card with topic checkboxes, validation, a counting reader number, a success check with the chosen topics and a sidebar of recent issues you can open.
- `changelog-teaser` (Pro, marketing): Release timeline with version chips, New/Improved/Fixed badges, a highlighted latest release, expandable change lists, RSS copy and an email subscribe toggle.
- `integrations-wall` (Pro, marketing): Eighteen brand-tinted integration tiles with category tabs, search, connect/disconnect state, coming-soon notify requests through a dialog and an empty state that points to automation.
- `how-it-works-steps` (Pro, marketing): Three numbered steps on a connector line that fills as a play button runs the setup through, each step with a live mock (import, share link, payout) and a completion message.
- `team-grid` (Pro, marketing): Department-filtered team grid with abstract tinted portraits, a hover overlay revealing one fact per person, staggered entrance and a profile dialog with social links.
- `careers-list` (Pro, marketing): Open roles grouped by team with search, team and location selects, salary bands, new badges, a job alert toggle, and an apply dialog that validates and confirms.
- `contact-split` (Pro, marketing): Contact page split between channel cards (chat, copyable phone and email), office tiles with map-less grids and hours, and a validated message form with a reason select and a thank-you state.
- `welcome-checklist` (Pro, onboarding): Gradient welcome panel with a progress ring and minutes left beside a day-by-day task list; each task expands to explain why, can be done or skipped with undo, and the last one fires confetti.
- `tour-hotspots` (Pro, onboarding): Pulsing numbered hotspots over an app mock with a dimmed spotlight mask, coach-mark cards with shortcuts and progress dots, arrow-key navigation, seen state and a replay bar.
- `empty-states-pack` (Pro, onboarding): No data, no results, error and offline states with inline SVG illustrations, each recovering to a real screen: CSV import with progress, filter removal, retry that eventually succeeds, and offline sync.
- `setup-wizard` (Pro, onboarding): Four-step business setup with a vertical stepper, radio cards that suggest services, open-day toggles, an editable service table, deposit settings and a confetti go-live screen with a copyable link.
- `import-progress` (free, onboarding): Live CSV import screen with a rolling row counter, striped progress, stage checklist, just-imported feed, auto-fixed warnings with a CSV report download, pause/resume and a cancel confirmation.
- `product-grid-quickview` (Pro, commerce): Retail grid with drawn product art, sale and sold-out states, wishlist hearts, brand and sort selects, inline quantity steppers, a live cart total and a quick-view dialog with size, quantity and add.
- `product-detail` (Pro, commerce): Product page with view thumbnails, size cards with best-value tag, scent swatches that recolor the art, subscribe-and-save pricing that rolls, add-to-bag confetti, share and wishlist, plus details and a reviews breakdown.
- `cart-drawer` (Pro, commerce): Spring drawer over a shop page with free-shipping progress, quantity steppers, remove with undo, promo codes that validate, suggested add-ons, a rolling total and checkout, empty and placed states.
- `checkout-steps` (Pro, commerce): Three-step checkout (contact, delivery, payment) with a sticky order summary, pickup or shipping options that reprice, card validation with Luhn and brand detection, a wallet option and a confetti confirmation.
- `order-tracking` (free, commerce): Parcel tracking with a route map whose truck moves along the path as scans arrive, a timeline of stages, copyable tracking number, text-me-updates dialog, receipt download and a simulate button.
- `staff-schedule-week` (Pro, booking): Team-by-day shift grid with colored shift pills, hours-vs-target bars per person, a coverage-vs-needed footer, click-to-edit shift templates, copy last week, undo and publish.
- `client-profile` (free, booking): Cover-art client card with lifetime value, visits and copyable contact details, editable tags, a monthly spend chart, next-visit card, visit timeline with ratings, team notes with undo and copyable color formulas, plus book and SMS actions.
- `service-menu-editor` (Pro, booking): Drag-to-reorder service list by category with inline name, duration and price editing, online-booking toggles, remove with undo, an add-service dialog and a live phone preview of the public booking page.
- `pos-checkout` (Pro, booking): Point-of-sale cart with quantities, quick-add chips and promo codes beside a dark payment panel: rolling total, tip presets or custom tip on services, card/cash/gift card with a cash keypad and change due, then a success screen with receipt actions.
- `reviews-manager` (Pro, booking): Average rating with a clickable star distribution, needs-reply and low-rating filters, source chips (Google, Facebook, Yelp, app), inline replies with AI suggestions, thank and report actions and an undo toast.
- `loyalty-program` (Pro, booking): Four gradient tier cards, editable earning rules (points per dollar, referral and birthday bonuses), a rewards list with add and remove, and a member simulator whose points roll up, progress ring fills and confetti fires on a tier-up.
- `gift-card-issue` (free, booking): Amount chips or custom amount, five card designs, occasion tags, recipient and delivery fields with validation, and a live 3D-flipping gift card preview that reveals the redeem code once issued, with copy, save and resend.
- `intake-form` (Pro, booking): Three-step new-client intake (about you, health, preferences) with a progress header, validation per step, conditional allergy details and patch-test consent, goal chips and a thank-you screen.
- `consent-form` (free, booking): Scroll-to-read consent document with a reading progress meter that unlocks the required statements, typed legal name, a draw-to-sign canvas with clear, validation and a signed-and-sealed state with a downloadable copy.
- `no-show-policy` (Pro, booking): Deposit mode and amount, a cancellation-window slider with fee inputs, reminder cards with impact estimates, a repeat no-show rule, a live what-clients-see policy card and an estimated monthly impact panel with rolling numbers.
- `resource-allocation` (Pro, booking): Day timeline of chairs and rooms with utilization rings: pick an unassigned booking and compatible free slots light up green while busy or under-equipped rows show why, plus auto-assign, click-to-free and undo.
- `membership-editor` (Pro, booking): Recurring revenue and member KPIs over cards for prepaid packages and monthly or yearly memberships with on-sale toggles, perks lists, a best-seller highlight, delete with undo and a full editor dialog with unlimited visits and perks.
- `prompt-library` (free, ai): Folder sidebar with counts and a starred filter, searchable prompt cards with highlighted {{variables}}, tags, versions and usage, a use dialog that fills variables into a live preview with copy and send, plus new prompt and delete with undo.
- `eval-results` (Pro, ai): Baseline-vs-candidate scoreboard (score, pass rate, latency), category and regression filters, a case table with pass/fail score badges and deltas, rows that expand into a split diff of both answers with the judge's reasoning, human votes that can override a blocked promotion, and CSV export.
- `ai-usage-dashboard` (Pro, ai): Spend, tokens and requests KPIs, a stacked daily cost-by-model bar chart, a monthly budget token meter with segments, editable budget and alert threshold, and a per-feature table with cost share bars and sparklines, plus CSV export.
- `assistant-settings` (Pro, ai): Model picker with speed, quality and price meters, a temperature slider with plain-English hints, max tokens, a system prompt editor with tone chips, tool permission cards with risky-tool confirmation, and a test panel that streams a sample reply.
- `knowledge-sources` (Pro, ai): Website, PDF, sheet and Notion sources with chunk counts, sync status, animated re-indexing progress, errors with fixes, enable toggles and remove with undo, an add-source dialog and a retrieval tester that shows matched chunks with scores.
- `conversation-inspector` (Pro, ai): Transcript with a latency timeline where every assistant turn opens model, tokens, cost and confidence, expandable tool calls, retrieved chunks with scores and guardrail results, plus flag, add-to-evals and JSON export.
- `guardrail-rules` (Pro, ai): Input/output rules for card numbers, emails, medical advice, prompt injection and more with enable toggles and block/redact/warn actions, a regex rule builder with validation, and a tester that runs the rules on a message and shows the verdict, matches and redacted text.
- `fine-tune-jobs` (free, ai): Job list with status filters, live training progress and loss sparklines, a detail panel with an animated loss curve, metadata, deploy-to-assistant, cancel with confirmation, retry for failures and a log console, plus a new-job dialog with a cost estimate.
- `sql-explorer` (Pro, tables): SQL editor with Cmd/Ctrl+Enter, run, copy, save and ask-AI, a history and schema sidebar that inserts table and column names, a read-only guard with error messages, and a results grid with row limit and CSV export.
- `pipeline-runs` (Pro, dashboard): ETL pipeline DAG with per-step status, durations, rows and logs, a failed step with a suggested fix and retry-from-failure, run-now that animates a new run through every step, a schedule toggle and a run history with stacked duration bars.
- `schema-browser` (free, tables): Searchable schema and table tree beside a table page with row counts, related-table chips, column list with primary and foreign keys that navigate, sample rows and generated DDL, each copyable.
- `saved-views` (Pro, tables): Pinned and all saved views with emoji, default star and a per-view menu (pin, default, rename inline, duplicate, delete with undo), a preview with removable filter chips and sort, a share dialog with access levels and copy link, and a create dialog.
- `data-quality-alerts` (Pro, dashboard): Data health score, open and resolved alerts with severity edges and acknowledge, resolve and snooze (with undo), and a checks list for freshness, volume, nulls, schema and uniqueness with 7-day sparklines, toggles and an add-check dialog.
- `dataset-catalog` (Pro, tables): Searchable grid or list of datasets with domain chips, certified, PII and experimental tags, freshness, query counts, quality bars and stars, and a detail dialog with lineage you can click through and request-access or open-in-explorer actions.
- `export-center` (free, tables): Export jobs with format icons, animated progress, ready downloads that really save a file, failed and expired states with retry, delete with undo, scheduled exports with toggles and a new-export dialog with source, range, format and column picking.
- `api-usage` (Pro, dashboard): Requests, p95 latency, error rate and rate-limit KPIs, a requests area chart with range switch, a status-code donut, an endpoint table sortable by calls, p95 or errors with layered latency bars, and per-key rate-limit meters, plus CSV export.
- `feature-flags` (Pro, tables): Flag table with dev, staging and prod switches, type and stale badges and search, a detail panel with a production rollout slider, targeting rules you add and remove, a code snippet, a kill switch with confirmation, archive with undo and change history.
- `experiment-results` (Pro, dashboard): A/B test with a significance verdict computed from a real two-proportion z-test (p-value, confidence interval, lift), variant cards with conversion bars, a daily conversion line chart with metric switch, pause and resume, and a ship-the-winner confirmation.
