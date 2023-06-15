import axios from 'axios'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((NuxtApp) => {
  axios.defaults.withCredentials = true
  axios.defaults.baseUrl = process.env.API_URL

  return {
    provide: {
      axios,
    },
  }
})
