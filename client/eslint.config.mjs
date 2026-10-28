import antfu from '@antfu/eslint-config'

export default antfu({
	type: 'app',
	vue: true,
	stylistic: false,
	ignores: ['.nuxt*/**', '.output/**', '.data/**'],
	rules: {
		// Keep existing formatting and intentional confirmation dialogs.
		'vue/html-indent': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'perfectionist/sort-imports': 'off',
		'jsonc/sort-keys': 'off',
		'node/prefer-global/process': 'off',
		'no-alert': 'off',
		eqeqeq: 'off'
	}
})
