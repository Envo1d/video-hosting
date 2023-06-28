import { defineStore } from 'pinia'
import type { IPost } from '~/types/post.interface'

interface RootState {
  id: string
  name: string
  bio: string
  image: string
  post: IPost | null
  posts: IPost[] | null
  allLikes: number
  following: number
  followers: number
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    id: '',
    name: '',
    bio: '',
    image: '',
    post: null,
    posts: null,
    allLikes: 0,
    following: 0,
    followers: 0,
  } as RootState),
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
      this.following = res.data.user.subscriptions
      this.followers = res.data.user.subscribers

      this.allLikesCount()
    },

    allLikesCount() {
      this.allLikes = 0
      if (this.posts !== null) {
        for (let i = 0; i < this.posts.length; i++) {
          const post = this.posts[i]
          this.allLikes += post.likes.length
        }
      }
    },

    resetUser() {
      this.$state.id = ''
      this.$state.name = ''
      this.$state.bio = ''
      this.$state.image = ''
      this.$state.posts = null
      this.$state.following = 0
      this.$state.followers = 0
    },
  },
  persist: true,
})
