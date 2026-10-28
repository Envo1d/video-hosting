/** @type {import('tailwindcss').Config} */
import twColors from 'tailwindcss/colors'

const colors = {
  main: '#17171E',
  primary: '#230d3e',
  secondary: '#AD00FF',
  white: twColors.white,
  transparent: twColors.transparent,
  gray: '#747478',
  red: twColors.red,
}

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    colors,
    extend: {},
  },
  plugins: [],
}
