import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: '/',
    posts: null,
    suggested: null,
    following: null,
  }),
  actions: {
    bodySwitch(val: any) {
      if (val) {
        document.body.style.overflow = 'hidden'
        return
      }
      document.body.style.overflow = 'visible'
    },

    async hasSessionExpired() {
      const { $axios } = useNuxtApp()

      await $axios.interceptors.response.use((response) => {
        return response
      }, (error: any) => {
        switch (error.response.status) {
          case 401:
          case 419:
            useUserStore().resetUser()
            window.location.href = '/'
            break
          case 501:
            alert('Oops, something went wrong!')
            break
          default: return Promise.reject(error)
        }
      })
    },
  },
  persist: true,
})
