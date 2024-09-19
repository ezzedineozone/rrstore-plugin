/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.php',
    './rrstore-plugin/*.php',
    './rrstore-plugin/**/*.php',
    './rrstore-plugin/templates/*.php'
  ],
  theme: {
    extend: {
      colors: {
        'yellow-custom': '#E4C32D',
      },
    },
  },
  plugins: [],
}

