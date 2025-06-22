/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9E7FFF',
        secondary: '#38bdf8',
        accent: '#f472b6',
        background: '#111111',
        surface: '#1E1E1E',
        text: '#FFFFFF',
        'text-secondary': '#A3A3A3',
        border: '#2F2F2F',
        success: '#10b981',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px 0 rgba(158, 127, 255, 0.3)',
        'glow-accent': '0 0 15px 0 rgba(244, 114, 182, 0.2)',
      }
    },
  },
  plugins: [],
}
