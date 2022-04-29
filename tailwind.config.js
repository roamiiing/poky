module.exports = {
  content: ['./app/**/*.{html,vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      screens: {
        'media-hover': {
          raw: '(hover: hover)',
        },
      },
    },
  },
}
