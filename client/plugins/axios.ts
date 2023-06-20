import axios from 'axios'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const publicApi = axios.create({
    baseURL: useApiUrl(),
    withCredentials: true,
  })

  return {
    provide: {
      axios: publicApi,
    },
  }
})
