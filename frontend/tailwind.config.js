/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#111118',
        border: '#1e1e2e',
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#a855f7',
        },
        secondary: '#06b6d4',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        textPrimary: '#f1f5f9',
        textMuted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        code: ['JetBrains Mono', 'ui-monospace'],
      },
    },
  },
  plugins: [],
}

