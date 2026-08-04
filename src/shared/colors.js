// src/shared/colors.js
export const COLORS = {
  primary: 'blue',
  secondary: 'slate',
  accent: 'orange',
  text: 'slate-900',
  textLighter: 'slate-600',
  background: 'slate-100', // A lighter base for content
};

export const COLOR_VARIANTS = {
  primary: `bg-${COLORS.primary}-600`,
  primaryHover: `hover:bg-${COLORS.primary}-700`,
  primaryText: `text-${COLORS.primary}-600`,
  accent: `bg-${COLORS.accent}-500`,
  accentHover: `hover:bg-${COLORS.accent}-600`,
};