# Themes

The theme boundary is intentionally clean. Theme code is separate from resume data.

## Available themes

- `default`
- `modern`

Theme registry:

- `src/themes/registry.js`

Each theme file is responsible only for presentation, layout, colors, and spacing. A theme should never hold resume content or business logic.

## How to add a new theme

1. Create a folder under `src/themes/your-theme/`.
2. Add a theme component like `YourTheme.jsx`.
3. Add any CSS-only styling for the theme.
4. Register the theme in `src/themes/registry.js`.

The rest of the application remains unchanged.
