import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useUserStore()

	userStore.getUser()

	if (to.path !== '/' && !userStore.id) return navigateTo('/')
})
