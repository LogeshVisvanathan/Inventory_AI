/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        paragraph: ['Azeret Mono', 'monospace'],
        mono: ['Azeret Mono', 'monospace'],
      },
      colors: {
        destructive: '#FF0000',
        'destructive-foreground': '#FFFFFF',
        'glass-background': 'rgba(255, 255, 255, 0.05)',
        'muted-text': '#888888',
        'chart-accent1': '#00FFFF',
        'chart-accent2': '#FF00FF',
        'chart-accent3': '#00FF7F',
        background: '#0A0A0A',
        secondary: '#FF00FF',
        foreground: '#E0E0E0',
        'secondary-foreground': '#0A0A0A',
        'primary-foreground': '#0A0A0A',
        primary: '#00FFFF',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'spin-slow-reverse': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'float-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(10px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%':      { opacity: 0.4, transform: 'scale(1.4)' },
        },
        'scan-line': {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        marquee:            'marquee 35s linear infinite',
        'spin-slow':        'spin-slow 10s linear infinite',
        'spin-slow-rev':    'spin-slow-reverse 15s linear infinite',
        'float-up':         'float-up 4s ease-in-out infinite',
        'float-down':       'float-down 5s ease-in-out infinite',
        'pulse-dot':        'pulse-dot 2s ease-in-out infinite',
        'scan-line':        'scan-line 3s linear infinite',
      },
    },
  },
  plugins: [],
}
