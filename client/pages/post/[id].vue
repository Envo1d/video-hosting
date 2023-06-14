<script setup>
function loopThroughPostsUp() {}
function loopThroughPostsDown() {}
function deletePost() {}
function deleteComment() {}
function addComment() {}
const isLoaded = ref(true)
const video = ref(null)
const inputFocused = ref(false)
const comment = ref(null)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  isLoaded.value = true
  video.value.play()
  // video.value.addEventListener('loadeddata', (e) => {
  //   if (e.target) {
  //     setTimeout(() => {
  //       isLoaded.value = true
  //     }, 500)
  //   }
  // })
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
</script>

<template>
  <div id="PostPage" class="fixed lg:flex justify-between z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto">
    <div class="lg:w-[calc(100%-540px)] h-full relative">
      <NuxtLink class="absolute z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800">
        <Icon name="material-symbols:close" color="#ffffff" size="27" />
      </NuxtLink>

      <div v-if="true">
        <button
          :disabled="!isLoaded"
          class="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
          @click="$event => loopThroughPostsUp()"
        >
          <Icon name="mdi:chevron-up" size="30" color="#ffffff" />
        </button>

        <button
          :disabled="!isLoaded"
          class="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
          @click="$event => loopThroughPostsDown()"
        >
          <Icon name="mdi:chevron-down" size="30" color="#ffffff" />
        </button>
      </div>

      <img src="~/assets/images/tiktok-logo-small.png" width="45" class="absolute top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto">

      <video v-if="true" class="absolute object-cover w-full my-auto z-[-1] h-screen" src="/water.mp4" />

      <div
        v-if="!isLoaded"
        class="flex items-center justify-center bg-black bg-opacity-70 h-screen lg:min-w-[480px]"
      >
        <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#ffffff" />
      </div>

      <div class="bg-black bg-opacity-70 lg:min-w-[480px]">
        <video v-if="true" ref="video" loop muted class="h-screen mx-auto" src="/water.mp4" />
      </div>
    </div>

    <div
      v-if="true"
      id="InfoSection"
      class="lg:max-w-[550px] relative w-full h-full bg-white"
    >
      <div class="py-7" />

      <div class="flex items-center justify-between px-8">
        <div class="flex items-center">
          <NuxtLink href="/">
            <img class="rounded-full lg:mx-0 mx-auto" width="40" src="https://picsum.photos/id/8/300/320">
          </NuxtLink>
          <div class="ml-3 pt-0.5">
            <div class="font-semibold text-[17px]">
              User name
            </div>
            <div class="-mt-5 font-light text-[13px]">
              User name
              <span class="relative -top-[2px] text-[30px] pr-0.5">.</span>
              <span class="font-medium">Date here</span>
            </div>
          </div>
        </div>

        <Icon v-if="true" class="cursor-pointer" size="25" name="material-symbols:delete-outline-sharp" @click="$event => deletePost()" />
      </div>

      <div class="px-8 mt-4 text-sm">
        This is the post text
      </div>

      <div class="px-8 mt-4 text-sm font-bold">
        <Icon size="17" name="mdi:music" />
        original sound - User name
      </div>

      <div class="flex items-center px-8 mt-8">
        <div class="pb-4 text-center flex items-center">
          <button class="rounded-full bg-gray-200 p-2 cursor-pointer">
            <Icon size="25" name="mdi:heart" />
          </button>
          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
            123
          </span>
        </div>

        <div class="pb-4 text-center flex items-center">
          <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
            <Icon size="25" name="bx:bxs-message-rounded-dots" />
          </div>
          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
            123
          </span>
        </div>
      </div>

      <div
        id="Comments"
        class="bg-[#f8f8f8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
      >
        <div class="pt-2" />

        <div v-if="false" class="text-center mt-6 text-xl text-gray-500">
          No comments...
        </div>

        <div v-else class="flex items-center justify-between px-8 mt-4">
          <div class="flex items-center relative w-full">
            <NuxtLink to="/">
              <img src="https://picsum.photos/id/8/300/320" width="40" class="absolute top-0 rounded-full lg:mx-0 mx-auto">
            </NuxtLink>
            <div class="ml-14 pt-0.5 w-full">
              <div class="font-semibold flex items-center justify-between text-[18px]">
                User name
                <Icon v-if="true" class="cursor-pointer" size="25" name="material-symbols:delete-outline-sharp" @click="$event => deleteComment()" />
              </div>
              <div class="font-light text-[15px]">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga, aliquam. Magnam asperiores repellat, consectetur nulla, exercitationem at dolor facilis, qui quibusdam totam eum autem earum. Est veniam saepe magni libero?
              </div>
            </div>
          </div>
        </div>
        <div class="mb-28" />
      </div>

      <div
        v-if="true"
        id="CreateComment"
        class="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
      >
        <div
          :class="inputFocused ? 'border-2 border-gray-400' : 'border-2 border-[#f1f1f2]'"
          class="flex items-center rounded-lg w-full lg:max-w-[420px]"
        >
          <input v-model="comment" class="bg-[#f1f1f2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg" type="text" placeholder="Add comment..." @focus="$event => inputFocused = true" @blur="$event => inputFocused = false">
        </div>
        <button class="font-semibold text-sm ml-5 pr-1" :disabled="!comment" :class="comment ? 'text-[#f02c56] cursor-pointer' : 'text-gray-400'" @click="$event => addComment()">
          Post
        </button>
      </div>
    </div>
  </div>
</template>
