<script setup lang='ts'>
import type { PropType } from 'nuxt/dist/app/compat/capi'
import type { IPost } from '~/types/post.interface'

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})

const { $generalStore } = useNuxtApp()
const { post } = toRefs(props)
const router = useRouter()
const video = ref<HTMLVideoElement>()
const currentTime = ref<string>('00:00')
const isHover = ref(false)

function displayPost(id: string) {
  $generalStore.setBackUrl('/')
  $generalStore.selectedPost = null
  setTimeout(() => router.push(`/post/${id}`), 200)
}

function setCurrentTime() {
  currentTime.value = $generalStore.convertTime(video.value?.currentTime)
}

function mouseEnter() {
  video.value?.play()
  video.value?.addEventListener('timeupdate', setCurrentTime, true)
  isHover.value = true
}

function mouseLeave() {
  video.value?.pause()
  if (video.value)
    video.value.currentTime = 0
  video.value?.removeEventListener('timeupdate', setCurrentTime, true)
  currentTime.value = $generalStore.convertTime(video.value?.duration)
  isHover.value = false
}

function loadedData() {
  if (video.value?.readyState === 4)
    currentTime.value = $generalStore.convertTime(video.value?.duration)
}
</script>

<template>
  <div
    v-if="post.user" class="flex py-6"
    @mouseenter="() => mouseEnter()" @mouseleave="() => mouseLeave()"
  >
    <div class="pl-3 w-full px-4">
      <div class="flex items-center justify-between pb-0.5" />

      <div class="mt-2.5 flex">
        <div
          class="relative h-[200px] w-[350px] flex items-center bg-black rounded-2xl cursor-pointer bg-[#000]"
          @click="displayPost(post.id)"
        >
          <img :src="post.iconUrl" class="absolute flex items-center justify-center top-0 left-0 object-cover rounded-md bg-black h-[200px] w-[350px] transition-all duration-300" :class="!isHover ? 'opacity-100' : 'opacity-0'">
          <video
            v-if="post.videoUrl" ref="video"
            :class="isHover ? 'opacity-100' : 'opacity-0'"
            :src="post.videoUrl" loop muted class="object-cover mx-auto h-full" @loadeddata="() => loadedData()"
          />

          <div class="absolute right-2 bottom-2 text-white text-xs py-0.5 px-3 bg-[#000] bg-opacity-30 rounded-3xl">
            {{ currentTime }}
          </div>
        </div>
      </div>
      <div class="flex flex-row mt-2">
        <div class="cursor-pointer mt-2" @click="router.push(`/profile/${post.user.link}`)">
          <img :src="post.user.image" class="rounded-full max-h-[35px]" width="35">
        </div>
        <div class="flex flex-col items-start">
          <div class="text-[16px] overflow-hidden text-ellipsis whitespace-nowrap cursor-default pb-0.5 break-words max-w-[290px] text-white ml-3">
            {{ post.title }}
          </div>
          <button class="ml-3" @click="router.push(`/profile/${post.user.id}`)">
            <span class="text-[14px] text-white cursor-pointer">
              {{ post.user.name }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
