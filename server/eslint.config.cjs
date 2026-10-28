const parser = require('@typescript-eslint/parser')
const plugin = require('@typescript-eslint/eslint-plugin')

module.exports = [{
	files: ['src/**/*.ts'],
	languageOptions: { parser, parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname } },
	plugins: { '@typescript-eslint': plugin },
	rules: {
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }]
	}
}]
