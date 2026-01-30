# Shape Effects Library (After Effects)

This repository contains a ScriptUI panel for Adobe After Effects that provides a small library of shape-based animation presets. Each effect can be imported into the active composition as a precomposition that matches the parent comp's resolution, duration, and frame rate.

## Files

- `ae_shape_effects_panel.jsx` — ScriptUI panel written in ExtendScript (JavaScript for After Effects).

## Usage

1. Copy `ae_shape_effects_panel.jsx` into your After Effects ScriptUI Panels folder (for example: `Adobe After Effects/Support Files/Scripts/ScriptUI Panels/`).
2. Launch After Effects and open **Window → Shape Effects**.
3. Select an effect from the list and click **Import to Comp**.
4. A precomposition containing the animation will be added to your active composition.

## Included effects

- Pulse Circle
- Trim Path Stroke
- Repeater Burst
- Wiggle Stroke
- Morphing Path

You can extend the `EFFECTS` array and add additional functions to create more animations.
