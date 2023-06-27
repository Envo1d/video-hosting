import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  if (to.path !== '/' && !userStore.id)
    return navigateTo('/')
})
