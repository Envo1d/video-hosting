<script setup lang='ts'>
import type { PropType } from 'nuxt/dist/app/compat/capi'
import type { IPost } from '~/types/post.interface'

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
})
const { $generalStore, $userStore } = useNuxtApp()
const { post } = toRefs(props)

const router = useRouter()

const video = ref<HTMLVideoElement>()

function displayPost(id: string) {
  $generalStore.setBackUrl('/')
  $generalStore.selectedPost = null
  setTimeout(() => router.push(`/post/${id}`), 200)
}

async function copyLink(id: string) {
  const appUrl = useAppUrl()
  try {
    await useClipboard().toClipboard(`${appUrl}/post/${id}`)
    await $generalStore.updateReposts(id)
    $generalStore.notificationType = 'copy'
    setTimeout(() => $generalStore.notificationType = null, 800)
  }
  catch (e) {
    console.error(e)
  }
}

const postState = computed(() => {
  const like = post.value.likes.find(like => like.userId === $userStore.id)
  let likeExists = false
  if (like)
    likeExists = true

  const follow = $userStore.subscriptions?.includes(post.value.user.id)

  return { like: likeExists, follow }
})

async function likePost(post: IPost) {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  try {
    await $userStore.likePost(post, false)
  }
  catch (error) {
    console.error(error)
  }
}

async function unlikePost(post: IPost) {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  try {
    await $userStore.unlikePost(post, false)
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting)
      video.value?.play()
    else video.value?.pause()
  }, { threshold: [0.6] })

  observer.observe(document.getElementById(`PostMain-${post.value.id}`) as HTMLElement)
})

onBeforeUnmount(() => {
  video.value?.pause()
})
</script>

<template>
  <div v-if="post.user" :id="`PostMain-${post.id}`" class="flex border-b py-6">
    <div class="cursor-pointer" @click="router.push(`/profile/${post.user.id}`)">
      <img :src="post.user.image" class="rounded-full max-h-[60px]" width="60">
    </div>
    <div class="pl-3 w-full px-4">
      <div class="flex items-center justify-between pb-0.5">
        <button @click="router.push(`/profile/${post.user.id}`)">
          <span class="font-bold hover:underline cursor-pointer">{{ $generalStore.allLowerCaseNoCaps(post.user.name) }}</span>
          <span class="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">
            {{ post.user.name }}
          </span>
        </button>

        <button
          v-if="post.user.id !== $userStore.id && !postState.follow"
          class="border text-[15px] px-[21px] py-0.5 border-[#f02c56] text-[#f02c56] hover:bg-[#ffeef2] font-semibold rounded-md"
        >
          Follow
        </button>
      </div>

      <div class="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
        {{ post.text }}
      </div>

      <div class="text-[14px] text-gray-500 pb-0.5">
        #fun #cool #Super
      </div>
      <div class="text-[14px] pb-0.5 flex items-center font-semibold">
        <Icon size="17" name="mdi:music" />
        <div class="px-1">
          original sound - AWESOME
        </div>
        <Icon size="20" name="mdi:heart" />
      </div>
      <div class="mt-2.5 flex">
        <div
          class="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer"
          @click="displayPost(post.id)"
        >
          <video
            v-if="post.videoUrl"
            ref="video" :src="post.videoUrl" loop muted class="rounded-xl object-cover mx-auto h-full"
          />

          <img class="absolute right-2 bottom-14" width="90" src="~/assets/images/tiktok-logo-white.png">
        </div>
        <div class="relative mr-[75px]">
          <div class="absolute bottom-0 pl-2">
            <div class="pb-4 text-center">
              <button
                class="rounded-full bg-gray-200 p-2 cursor-pointer"
                @click="() => postState.like ? unlikePost(post) : likePost(post)"
              >
                <Icon name="mdi:heart" size="25" :color="postState.like ? '#f02c56' : ''" />
              </button>
              <span class="text-xs text-gray-800 font-semibold">{{ post.likes.length }}</span>
            </div>

            <div class="pb-4 text-center">
              <button
                class="rounded-full bg-gray-200 p-2 cursor-pointer"
                @click="displayPost(post.id)"
              >
                <Icon name="bx:bxs-message-rounded-dots" size="25" />
              </button>
              <span class="text-xs text-gray-800 font-semibold">{{ post.comments.length }}</span>
            </div>

            <div class="pb-4 text-center">
              <button
                class="rounded-full bg-gray-200 p-2 cursor-pointer"
                @click="copyLink(post.id)"
              >
                <Icon name="ri:share-forward-fill" size="25" />
              </button>
              <span class="text-xs text-gray-800 font-semibold">{{ post.reposts }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
