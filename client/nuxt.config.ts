import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	srcDir: '.',
	buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
	devtools: { enabled: true },
	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
		},
	},
	ssr: false,
	routeRules: {
		'/test': { ssr: true },
	},
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/icon', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
	runtimeConfig: {
		public: {
			apiUrl: process.env.API_URL,
			appUrl: process.env.APP_URL,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
})
