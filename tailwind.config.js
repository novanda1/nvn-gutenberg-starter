module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.html'],
    options: {
      keyframes: true
    }
  },
  prefix: 'nvn-', // use prefix to avoid duplication
  corePlugins: {
    preflight: false
  }
}
