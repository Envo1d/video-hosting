<script setup lang='ts'>
import type { IPost } from '~/types/post.interface'

defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
const { $generalStore } = useNuxtApp()

const video = ref<HTMLVideoElement>()
const currentTime = ref<string>('00:00')
const isLoaded = ref(false)
const isHover = ref(false)

function setCurrentTime() {
  currentTime.value = $generalStore.convertTime(video.value?.currentTime)
}

onMounted(() => {
  if (video.value) {
    video.value.addEventListener('loadeddata', (e) => {
      if (e.target) {
        setTimeout(() => {
          isLoaded.value = true
          if (video.value?.readyState === 4)
            currentTime.value = $generalStore.convertTime(video.value?.duration)
        }, 200)
      }
    })
  }
})

function displayPost(id: string) {
  $generalStore.setBackUrl(`/profile/${route.params.id}`)
  $generalStore.selectedPost = null
  setTimeout(() => router.push(`/post/${id}`), 300)
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
</script>

<template>
  <div
    class="relative mb-10 brightness-90 bg-[#000] hover:brightness-[1.1] cursor-pointer h-[200px] w-[350px]"
    @click="displayPost(post.id)"
    @mouseenter="() => mouseEnter()"
    @mouseleave="() => mouseLeave()"
  >
    <div v-if="!isLoaded" class="absolute flex items-center justify-center top-0 left-0 object-cover rounded-md bg-black h-[200px] w-[350px]">
      <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#ffffff" />
    </div>

    <div>
      <img :src="post.iconUrl" class="absolute flex items-center justify-center top-0 left-0 object-cover rounded-md bg-black h-[200px] w-[350px] transition-all duration-300" :class="!isHover ? 'opacity-100' : 'opacity-0'">
      <video ref="video" muted loop class="h-[200px] w-[350px] rounded-md transition duration-300" :class="isHover ? 'opacity-100' : 'opacity-0'" :src="post.videoUrl" />
      <div class="absolute right-2 bottom-2 text-white text-xs py-0.5 px-3 bg-[#000] bg-opacity-30 rounded-3xl">
        {{ currentTime }}
      </div>
    </div>

    <div class="text-white text-[15px] pt-1 break-words overflow-hidden text-ellipsis whitespace-nowrap">
      {{ post.title }}
    </div>
  </div>
</template>
