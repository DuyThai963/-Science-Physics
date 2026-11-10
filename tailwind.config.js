/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#09090b',
        surface: {
          DEFAULT: '#121215',
          elevated: '#18181b',
          highlight: '#27272a',
        },
        border: {
          subtle: '#27272a',
          strong: '#3f3f46',
        },
        accent: {
          DEFAULT: '#ffffff',
          hover: '#e4e4e7',
          glow: 'rgba(255, 255, 255, 0.15)',
        },
        foreground: {
          primary: '#f4f4f5',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-subtle': '0 0 20px -3px rgba(255, 255, 255, 0.12)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}
