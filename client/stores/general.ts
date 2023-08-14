import { defineStore } from 'pinia'
import type { ILitePost, IPost } from '~/types/post.interface'
import type { IUser } from '~/types/user.interface'
import { useUserStore } from './user'

interface RootState {
  isLoginOpen: boolean
  isEditProfileOpen: boolean
  isEditProfileBackOpen: boolean
  selectedPost: IPost | null
  ids: string[] | null
  isBackUrl: string
  posts: IPost[] | null
  randomPosts: ILitePost[] | null
  followingPosts: IPost[] | null
  suggested: IUser[] | null
  following: IUser[] | null
}

export const useGeneralStore = defineStore('general', {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    isEditProfileBackOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: '/',
    posts: null,
    randomPosts: null,
    suggested: null,
    following: null,
  } as RootState),
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

      await $axios.interceptors.response.use(config => config, async (error) => {
        const originalRequest = error.config
        if (
          (error?.response?.status === 401
            || error?.response?.status === 403
            || error?.response?.status === 419)
          && error.config
          && !error.config._isRetry
        ) {
          originalRequest._isRetry = true
          try {
            await useUserStore().getTokens()
            return $axios.request(originalRequest)
          }
          catch (error) {
            if (catchError(error) === 'Could not refresh access token') {
              useUserStore().resetUser()
              window.location.href = '/'
            }
          }
        }

        throw error
      })
    },

    // async hasSessionExpired() {
    //   const { $axios } = useNuxtApp()

    //   await $axios.interceptors.response.use((response) => {
    //     return response
    //   }, async (error: any) => {
    //     switch (error.response.status) {
    //       case 401:
    //       case 403:
    //       case 419:
    //         useUserStore().resetUser()
    //         window.location.href = '/'
    //         break
    //       case 501:
    //         alert('Oops, something went wrong!')
    //         break
    //       default: return Promise.reject(error)
    //     }
    //   })
    // },

    async getRandomUsers() {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: '/global/get-random-users',
        method: 'GET',
      })

      this.suggested = res.data.suggested
      this.following = res.data.following
    },

    async getPostById(id: string) {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: '/posts',
        method: 'GET',
        params: {
          id,
        },
      })

      this.selectedPost = res.data.post
      this.ids = res.data.ids
    },

    convertTime(time: number | undefined) {
      if (time === undefined)
        return ''
      let seconds: number | string = Math.floor(time % 60)
      let minutes: number | string = Math.floor(time / 60) % 60
      let hours: number | string = Math.floor(time / 3600)

      seconds = seconds < 10 ? `0${seconds}` : seconds
      minutes = minutes < 10 ? `0${minutes}` : minutes
      hours = hours < 10 ? `0${hours}` : hours

      if (hours == 0)
        return `${minutes}:${seconds}`

      return `${hours}:${minutes}:${seconds}`
    },

    formatLikes(likes: number | undefined) {
      if (likes === undefined)
        return
      if (likes < 1000)
        return likes
      else if (likes >= 1000000)
        return `${(likes / 1000000).toFixed(1)}m`
      else if (likes >= 1000)
        return `${(likes / 1000).toFixed(1)}k`
    },

    formatDate(dateString: string | undefined) {
      if (dateString === undefined)
        return

      const date = new Date(dateString)
      const day = date.toLocaleString('en-EN', { day: '2-digit' })
      const month = date.toLocaleString('en-EN', { month: 'short' })
      const year = date.toLocaleString('en-EN', { year: 'numeric' })
      return `${day} ${month} ${year}`
    },

    async getAllUsersAndPosts() {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: '/global/home',
        method: 'GET',
      })

      this.posts = res.data.posts
    },

    async getRandomPosts(postId: string) {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: '/global/random',
        method: 'GET',
        params: {
          exclude: postId,
        },
      })

      this.randomPosts = res.data.posts
    },

    async getAllFollowingUsersAndPosts() {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: '/subscription/following-posts',
        method: 'GET',
      })

      this.followingPosts = res.data.posts
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
