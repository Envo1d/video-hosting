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

    allLowerCaseNoCaps(str: string) {
      return str.split(' ').join('').toLowerCase()
    },

    setBackUrl(url: string) {
      this.isBackUrl = url
    },

    async hasSessionExpired() {
      const { $axios } = useNuxtApp()

      await $axios.interceptors.response.use((response) => {
        return response
      }, async (error: any) => {
        switch (error.response.status) {
          case 401:
            await useUserStore().getTokens()
            break
          case 403:
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

    async getRandomUsers() {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: '/global/get-random-users',
        method: 'GET',
      })

      this.suggested = res.data.suggested
      this.following = res.data.following
    },

    updateSideMenuImage(array: any, user: any) {
      if (array !== null) {
        for (let i = 0; i < array.length; i++) {
          const res = array[i]
          if (res.id === user.id)
            res.image = user.image
        }
      }
    },
  },
  persist: true,
})
