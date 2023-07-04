import { defineStore } from 'pinia'
import type { IAuthResponse, ILoginData, IRegisterData } from '~/types/auth.interface'
import type { ILike, IPost } from '~/types/post.interface'
import { useGeneralStore } from './general'

interface RootState {
  id: string
  name: string
  email: string
  bio: string
  image: string
  backgroundImage: string
  subscriptions: string[] | null
  subscribers: string[] | null
}

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: '',
    email: '',
    bio: '',
    image: '',
    backgroundImage: '',
    subscribers: null,
    subscriptions: null,
  } as RootState),
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
      this.$state.backgroundImage = res.data.backgroundImage
      this.$state.subscribers = res.data.subscribers
      this.$state.subscriptions = res.data.subscriptions
    },

    async follow(id: string) {
      const { $axios } = useNuxtApp()

      await $axios({
        url: 'subscription/',
        method: 'POST',
        data: {
          id,
        },
      })
    },

    async unfollow(id: string) {
      const { $axios } = useNuxtApp()

      await $axios({
        url: 'subscription/',
        method: 'DELETE',
        data: {
          id,
        },
      })
    },

    async createPost(data: FormData) {
      const { $axios } = useNuxtApp()

      return await $axios({
        url: 'posts/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      })
    },

    async deletePost(post: IPost) {
      const { $axios } = useNuxtApp()

      return await $axios({
        url: 'posts/',
        method: 'DELETE',
        params: {
          id: post.id,
        },
      })
    },

    async likePost(post: any, isPostPage: boolean) {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: 'likes/',
        method: 'POST',
        data: {
          postId: post.id,
        },
      })

      let singlePost = null

      if (isPostPage)
        singlePost = post
      else
        singlePost = useGeneralStore()?.posts?.find(p => p.id === post.id)

      singlePost.likes.push(res.data.like)
    },

    async unlikePost(post: any, isPostPage: boolean) {
      const { $axios } = useNuxtApp()

      let singlePost = null
      let deleteLike: ILike = { userId: '', postId: '', id: '' }

      if (isPostPage)
        singlePost = post
      else
        singlePost = useGeneralStore()?.posts?.find(p => p.id === post.id)

      singlePost.likes.forEach((like: ILike) => {
        if (like.userId === this.id)
          deleteLike = like
      })

      if (deleteLike.id) {
        const res = await $axios({
          url: 'likes/',
          method: 'DELETE',
          data: {
            id: deleteLike.id,
          },
        })

        for (let i = 0; i < singlePost.likes.length; i++) {
          const like = singlePost.likes[i]
          if (like.id === res.data.like.id)
            singlePost.likes.splice(i, 1)
        }
      }
    },

    async addComment(post: IPost, comment: string) {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: 'comments/',
        method: 'POST',
        data: {
          postId: post.id,
          text: comment,
        },
      })

      if (res.status === 200)
        await this.updateComments(post)
    },

    async deleteComment(post: IPost, commentId: string) {
      const { $axios } = useNuxtApp()

      const res = await $axios({
        url: 'comments/',
        method: 'DELETE',
        data: {
          id: commentId,
        },
      })

      if (res.status === 200)
        await this.updateComments(post)
    },

    async updateComments(post: IPost) {
      const { $axios, $generalStore } = useNuxtApp()

      const res = await $axios({
        url: 'profile/',
        method: 'GET',
        params: {
          id: post.user.id,
        },
      })

      for (let i = 0; i < res.data.posts.length; i++) {
        const updatePost = res.data.posts[i]

        if (post.id === updatePost.id) {
          if ($generalStore.selectedPost)
            $generalStore.selectedPost.comments = updatePost.comments
        }
      }
    },

    async updateUserImage(data: FormData) {
      const { $axios } = useNuxtApp()

      return await $axios({
        url: 'users/upload-image',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      })
    },

    async updateUserBackImage(data: FormData) {
      const { $axios } = useNuxtApp()

      return await $axios({
        url: 'users/upload-back-image',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      })
    },

    async updateUser(name: string, bio: string) {
      const { $axios } = useNuxtApp()

      return await $axios({
        url: 'users/update-profile',
        method: 'POST',
        data: {
          name,
          bio,
        },
      })
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
      this.$state.subscribers = null
      this.$state.subscriptions = null
    },
  },
  persist: true,
})
