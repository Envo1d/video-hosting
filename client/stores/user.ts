import { defineStore } from 'pinia'
import type { IAuthResponse, ILoginData, IRegisterData } from '~/types/auth.interface'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: '',
    email: '',
    bio: '',
    image: '',
  }),
  actions: {
    async getTokens() {
      const { $axios } = useNuxtApp()

      await $axios.get('auth/refresh')
    },
    async auth(type: 'login' | 'register', data: ILoginData | IRegisterData) {
      const { $axios } = useNuxtApp()

      return await $axios<IAuthResponse> ({
        url: `auth/${type}`,
        method: 'POST',
        data,
      })
    },
    async getUser() {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: 'users/me',
        method: 'GET',
      })

      this.$state.id = res.data.id
      this.$state.name = res.data.name
      this.$state.image = res.data.image
      this.$state.bio = res.data.bio
    },

    async logout() {
      const { $axios } = useNuxtApp()

      await $axios.get('auth/logout')
      this.resetUser()
    },

    resetUser() {
      this.$state.id = ''
      this.$state.name = ''
      this.$state.email = ''
      this.$state.bio = ''
      this.$state.image = ''
    },
  },
  persist: true,
})
