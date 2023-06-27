<script setup>
const { $generalStore, $userStore, $profileStore } = useNuxtApp()

const isLoaded = ref(true)
const video = ref(null)
const inputFocused = ref(false)
const comment = ref(null)

const route = useRoute()
const router = useRouter()

const isLiked = computed(() => {
  const res = $generalStore.selectedPost.likes.find(like => like.userId === $userStore.id)
  if (res)
    return true
  return false
})

async function likePost() {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  try {
    await $userStore.likePost($generalStore.selectedPost, true)
  }
  catch (error) {
    console.error(error)
  }
}

async function unlikePost() {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  try {
    await $userStore.unlikePost($generalStore.selectedPost, true)
  }
  catch (error) {
    console.error(error)
  }
}

function loopThroughPostsUp() {
  setTimeout(() => {
    let isBreak = false
    const currentId = route.params.id

    for (let i = 0; i < $generalStore.ids.length; i++) {
      const id = $generalStore.ids[i]

      if (id === currentId && i !== $generalStore.ids.length - 1) {
        isBreak = true
        router.push(`/post/${$generalStore.ids[i + 1]}`)
        return
      }
    }
    if (!isBreak)
      router.push(`/post/${$generalStore.ids[0]}`)
  }, 300)
}

function loopThroughPostsDown() {
  setTimeout(() => {
    const idArrayReversed = $generalStore.ids.reverse()
    let isBreak = false
    const currentId = route.params.id

    for (let i = 0; i < idArrayReversed.length; i++) {
      const id = idArrayReversed[i]

      if (id === currentId && i !== idArrayReversed.length - 1) {
        isBreak = true
        router.push(`/post/${idArrayReversed[i + 1]}`)
        return
      }
    }
    if (!isBreak)
      router.push(`/post/${idArrayReversed[0]}`)
  }, 300)
}

async function deletePost() {
  const res = confirm('Are you sure you want to delete this video?')

  try {
    if (res) {
      await $userStore.deletePost($generalStore.selectedPost)
      await $profileStore.getProfile($userStore.id)
      router.push(`/profile/${$userStore.id}`)
    }
  }
  catch (error) {
    console.error(error)
  }
}

async function copyLink(id) {
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

async function deleteComment(commentId) {
  const res = confirm('Are you sure you want to delete this comment?')
  try {
    if (res)
      await $userStore.deleteComment($generalStore.selectedPost, commentId)
  }
  catch (error) {
    console.error(error)
  }
}

async function addComment() {
  try {
    await $userStore.addComment($generalStore.selectedPost, comment.value)
    comment.value = null
    document.getElementById('Comments').scroll({ top: 0, behavior: 'smooth' })
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  $generalStore.selectedPost = null

  try {
    await $generalStore.getPostById(route.params.id)
  }
  catch (error) {
    if (error && error.response.status === 400)
      router.push('/')
  }

  video.value.addEventListener('loadeddata', (e) => {
    if (e.target) {
      setTimeout(() => {
        isLoaded.value = true
      }, 500)
    }
  })
})

onBeforeUnmount(() => {
  video.value.pause()
  video.value.currentTime = 0
  video.value.src = ''
})

watch(() => isLoaded.value, () => {
  if (isLoaded.value)
    setTimeout(() => video.value.play(), 500)
})

watch(() => $generalStore.selectedPost, () => {})
</script>

<template>
  <div id="PostPage" class="fixed lg:flex justify-between z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto">
    <div v-if="$generalStore.selectedPost" class="lg:w-[calc(100%-540px)] h-full relative">
      <NuxtLink class="absolute z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800" :to="$generalStore.isBackUrl">
        <Icon name="material-symbols:close" color="#ffffff" size="27" />
      </NuxtLink>

      <div v-if="($generalStore.ids.length > 1)">
        <button
          :disabled="!isLoaded"
          class="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
          @click="() => loopThroughPostsUp()"
        >
          <Icon name="mdi:chevron-up" size="30" color="#ffffff" />
        </button>

        <button
          :disabled="!isLoaded"
          class="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
          @click="() => loopThroughPostsDown()"
        >
          <Icon name="mdi:chevron-down" size="30" color="#ffffff" />
        </button>
      </div>

      <img src="~/assets/images/tiktok-logo-small.png" width="45" class="absolute top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto">

      <video v-if="$generalStore.selectedPost.videoUrl" class="absolute object-cover w-full my-auto z-[-1] h-screen" :src="$generalStore.selectedPost.videoUrl" />

      <div
        v-if="!isLoaded"
        class="flex items-center justify-center bg-black bg-opacity-70 h-screen lg:min-w-[480px]"
      >
        <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#ffffff" />
      </div>

      <div class="bg-black bg-opacity-70 lg:min-w-[480px]">
        <video v-if="$generalStore.selectedPost.videoUrl" ref="video" autoplay loop class="h-screen mx-auto" :src="$generalStore.selectedPost.videoUrl" />
      </div>
    </div>

    <div
      v-if="$generalStore.selectedPost"
      id="InfoSection"
      class="lg:max-w-[550px] relative w-full h-full bg-white"
    >
      <div class="py-7" />

      <div class="flex items-center justify-between px-8">
        <div class="flex items-center">
          <NuxtLink :to="`/profile/${$generalStore.selectedPost.user.id}`">
            <img class="rounded-full lg:mx-0 mx-auto" width="40" :src="$generalStore.selectedPost.user.image">
          </NuxtLink>
          <div class="ml-3 pt-0.5">
            <div class="font-semibold text-[17px]">
              {{ $generalStore.allLowerCaseNoCaps($generalStore.selectedPost.user.name) }}
            </div>
            <div class="-mt-5 font-light text-[13px]">
              {{ $generalStore.selectedPost.user.name }}
              <span class="relative -top-[2px] text-[30px] pr-0.5">.</span>
              <span class="font-medium">{{ new Date($generalStore.selectedPost.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <Icon v-if="$userStore.id === $generalStore.selectedPost.user.id" class="cursor-pointer" size="25" name="material-symbols:delete-outline-sharp" @click="() => deletePost()" />
      </div>

      <div class="px-8 mt-4 text-sm">
        {{ $generalStore.selectedPost.text }}
      </div>

      <div class="px-8 mt-4 text-sm font-bold">
        <Icon size="17" name="mdi:music" />
        original sound - {{ $generalStore.allLowerCaseNoCaps($generalStore.selectedPost.user.name) }}
      </div>

      <Notification :notification-type="$generalStore.notificationType" />

      <div class="flex items-center px-8 mt-8">
        <div class="pb-4 text-center flex items-center">
          <button
            class="rounded-full bg-gray-200 p-2 cursor-pointer"
            @click="() => isLiked ? unlikePost() : likePost()"
          >
            <Icon size="25" name="mdi:heart" :color="isLiked ? '#f02c56' : ''" />
          </button>
          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
            {{ $generalStore.selectedPost.likes.length }}
          </span>
        </div>

        <div class="pb-4 text-center flex items-center">
          <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
            <Icon size="25" name="bx:bxs-message-rounded-dots" />
          </div>
          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
            {{ $generalStore.selectedPost.comments.length }}
          </span>
        </div>

        <div class="pb-4 text-center flex items-center">
          <button
            class="rounded-full bg-gray-200 p-2 cursor-pointer"
            @click="copyLink($generalStore.selectedPost.id)"
          >
            <Icon name="ri:share-forward-fill" size="25" />
          </button>
          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">{{ $generalStore.selectedPost.reposts }}</span>
        </div>
      </div>

      <div
        id="Comments"
        class="bg-[#f8f8f8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
      >
        <div class="pt-2" />

        <div v-if="($generalStore.selectedPost.comments.length < 1)" class="text-center mt-6 text-xl text-gray-500">
          No comments...
        </div>

        <div
          v-for="com in $generalStore.selectedPost.comments"
          v-else
          :key="com.id"
          class="flex items-center justify-between px-8 mt-4"
        >
          <div class="flex items-center relative w-full">
            <NuxtLink :to="`/profile/${com.user.id}`">
              <img :src="com.user.image" width="40" class="absolute top-0 rounded-full lg:mx-0 mx-auto">
            </NuxtLink>
            <div class="ml-14 pt-0.5 w-full">
              <div class="font-semibold flex items-center justify-between text-[18px]">
                {{ com.user.name }}
                <Icon v-if="$userStore.id === com.user.id" class="cursor-pointer" size="25" name="material-symbols:delete-outline-sharp" @click="() => deleteComment(com.id)" />
              </div>
              <div class="font-light text-[15px]">
                {{ com.text }}
              </div>
            </div>
          </div>
        </div>
        <div class="mb-28" />
      </div>

      <div
        v-if="$userStore.id"
        id="CreateComment"
        class="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
      >
        <div
          :class="inputFocused ? 'border-2 border-gray-400' : 'border-2 border-[#f1f1f2]'"
          class="flex items-center rounded-lg w-full lg:max-w-[420px]"
        >
          <input v-model="comment" class="bg-[#f1f1f2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg" type="text" placeholder="Add comment..." @focus="() => inputFocused = true" @blur="() => inputFocused = false">
        </div>
        <button class="font-semibold text-sm ml-5 pr-1" :disabled="!comment" :class="comment ? 'text-[#f02c56] cursor-pointer' : 'text-gray-400'" @click="() => addComment()">
          Post
        </button>
      </div>
    </div>
  </div>
</template>
