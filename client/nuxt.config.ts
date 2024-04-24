// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
	modules: ['nuxt-icon', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
	runtimeConfig: {
		public: {
			apiUrl: process.env.API_URL,
			appUrl: process.env.APP_URL,
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
})
