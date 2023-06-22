import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    id: '',
    name: '',
    bio: '',
    image: '',
    post: null,
    posts: null,
    allLikes: 0,
  }),
  actions: {
    async getProfile(userId: string) {
      const { $axios } = useNuxtApp()

      this.resetUser()

      const res = await $axios({
        url: 'profile/',
        method: 'GET',
        params: {
          id: userId,
        },
      })

      this.$state.id = res.data.user.id
      this.$state.name = res.data.user.name
      this.$state.bio = res.data.user.bio
      this.$state.image = res.data.user.image
      this.$state.posts = res.data.posts
    },

    resetUser() {
      this.$state.id = ''
      this.$state.name = ''
      this.$state.bio = ''
      this.$state.image = ''
      this.$state.posts = null
    },
  },
  persist: true,
})
