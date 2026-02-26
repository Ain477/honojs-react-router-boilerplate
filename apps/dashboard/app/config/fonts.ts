/**
 * List of available font names (visit the url `/settings/appearance`).
 * This array is used to generate dynamic font classes (e.g., `font-inter`, `font-manrope`).
 *
 * How to Add a New Font (Tailwind v4+):
 * 1. Add the font name here.
 * 2. Update the `<link>` tag in root.tsx to include the new font from Google Fonts (or any other source).
 * 3. Add the new font family to 'app.css' using the `@theme` and `font-family` CSS variable.
 */
export const fonts = ["inter", "manrope", "system"] as const;
