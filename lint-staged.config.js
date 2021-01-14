module.exports = {
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '*.{js,jsx,css,md,ts,tsx,html}': 'prettier --write',
}
