/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'phone': '340px', // 2sm
      'phoneTablet': '640px', // sm
      'tablet': '768px', // md
      'laptop': '1024px', // lg
      'desktopLaptop': '1280px', // xl
      'desktopWide': '1536px', // 2xl
    },
    extend: {
      colors: {
        'violet-light-radix': '#6952C8',
        'violet-regular-radix': '#6E56CF',
        'violet-dark-radix': '#32275F',
        'blue-violet-default': '#4338ca',
        'blue-violet-hover': '#4f46e5',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // disable this for conflict antd
  }
}
