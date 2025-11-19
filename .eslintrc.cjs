module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  plugins: ['vue'],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'postcss.config.js',
    'tailwind.config.js',
    'vite.config.js'
  ]
}