/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        storybook: {
          'forest-light': '#3c6e47', // Muted green
          'forest-base': '#2a4d32', // Deep forest green
          'forest-dark': '#182f1d',  // Very dark green for contrast
          'rust-light': '#c86b3c',   // Warm amber/rust
          'rust-base': '#a34923',    // Deep rust
          'rust-dark': '#733114',    // Darker rust for borders/shadows
          'teal-light': '#4c7b82',   // Muted teal
          'teal-base': '#2a4f55',    // Deep night teal
          'teal-dark': '#13282b',    // Very dark teal
          'ochre': '#d9a05b',        // Warm ochre light (dusk)
          'wood': '#8b5a2b',         // Log ring brown
        }
      },
      backgroundImage: {
        'dusk-gradient': 'linear-gradient(to bottom, #d9a05b 0%, #3c6e47 100%)', // warm ochre to forest green
        'night-gradient': 'linear-gradient(to bottom, #13282b 0%, #2a4f55 100%)', // dark teal to base teal
      },
      fontFamily: {
        // We'll stick to sans for now, but adding a hook for a storybook font if desired later
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
