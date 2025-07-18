export default {
  '*.ts': [() => 'tsgo -p tsconfig.json --noEmit', 'prettier --write'],
  '.prettierrc.yml': 'bun run prettier',
  'lint-staged.config.ts': 'bun run prettier',
  'package.json': 'bun run prettier',
}
