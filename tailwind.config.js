/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          50: '#F0F6FF',
          100: '#E0EDFE',
          200: '#BAE0FD',
          300: '#7CC5FB',
          400: '#38A4F8',
          500: '#0F84EB',
          600: '#0066CC',
          700: '#0052A3',
          800: '#004285',
          900: '#0B386B',
          950: '#072449',
        },
        slate: {
          850: '#151F32',
          950: '#0B0F19'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'panel': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 20px -5px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
