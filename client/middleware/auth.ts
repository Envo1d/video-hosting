import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to) => {
	const userStore = useUserStore()

	userStore.getUser()

	if (to.path !== '/' && !userStore.id) return navigateTo('/')
})
