# /assets/creatures

Drop your hand-drawn creature art here. This folder lives inside `public/` so
Next.js can serve it directly — a file saved as `public/assets/creatures/sunlight-companion.svg`
is reachable at the URL `/assets/creatures/sunlight-companion.svg`, which is exactly
what the `CreatureSlot` component looks for. You don't need to touch any component
code — just drop in a correctly-named file and it appears automatically, replacing
the geometric placeholder.

Supported formats: `.svg` (preferred, scales cleanly) or `.png` (transparent background
recommended). If both exist, `.svg` wins.

## Companions (swim alongside the depth gauge, one per zone)

- `sunlight-companion.svg`
- `twilight-companion.svg`
- `midnight-companion.svg`
- `abyssal-companion.svg`
- `hadal-companion.svg`

Suggested direction: make these more exotic and more bioluminescent the deeper the
zone goes. Sunlight can be a simple bright fish; Hadal can be something stranger,
glowing on its own.

## Reaction mascots (pop in when a step is completed)

- `reaction-sunlight.svg`
- `reaction-twilight.svg`
- `reaction-midnight.svg`
- `reaction-abyssal.svg`
- `reaction-hadal.svg`

Small, expressive, readable at ~48px.

## Ambient background creatures (slow drifting parallax decoration)

- `ambient-sunlight-1.svg`, `ambient-sunlight-2.svg`, `ambient-sunlight-3.svg`
- `ambient-twilight-1.svg`, `ambient-twilight-2.svg`, `ambient-twilight-3.svg`
- `ambient-midnight-1.svg`, `ambient-midnight-2.svg`, `ambient-midnight-3.svg`
- `ambient-abyssal-1.svg`, `ambient-abyssal-2.svg`, `ambient-abyssal-3.svg`
- `ambient-hadal-1.svg`, `ambient-hadal-2.svg`, `ambient-hadal-3.svg`

These should read fine when small, blurry, and half-transparent — they're background
texture, not the focus.

## Confirmation screen

- `discovery.svg` — the "something worth discovering" creature shown on the final
  confirmation screen after submission. This one's allowed to be the showpiece.

Until art exists at these paths, every slot renders a simple geometric placeholder
(circles, ellipses, a triangle fin) tinted to the current zone, so the layout never
looks broken while you're still drawing.
