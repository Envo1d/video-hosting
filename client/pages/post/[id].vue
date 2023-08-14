<script setup lang='ts'>
import { storeToRefs } from 'pinia'

const { $generalStore, $userStore, $profileStore } = useNuxtApp()
const { selectedPost } = storeToRefs($generalStore)

const comment = ref('')
const notification = ref('')
const isShowFullDesc = ref(false)
const input = ref<HTMLTextAreaElement>()

const route = useRoute()
const router = useRouter()

const isLiked = computed(() => {
  const res = $generalStore.selectedPost?.likes.find(like => like.userId === $userStore.id)
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

const isFollow = computed(() => {
  if ($userStore.id && $generalStore.selectedPost) {
    const res = $userStore.subscriptions?.includes($generalStore.selectedPost?.user.id as string)

    if (res)
      return true
    return false
  }
  return false
})

async function actionUser(type: 'follow' | 'unfollow') {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  try {
    if (type === 'follow')
      await $userStore.follow($generalStore.selectedPost?.user.id as string)
    else await $userStore.unfollow($generalStore.selectedPost?.user.id as string)
    await $userStore.getUser()
    await $generalStore.getRandomUsers()
    await $profileStore.getProfile($generalStore.selectedPost?.user.link as string)
  }
  catch (error) {
    console.error(error)
  }
}

async function deletePost() {
  const res = confirm('Are you sure you want to delete this video?')

  try {
    if (res) {
      if ($generalStore.selectedPost)
        await $userStore.deletePost($generalStore.selectedPost)
      await $profileStore.getProfile($userStore.id)
      router.push(`/profile/${$userStore.id}`)
    }
  }
  catch (error) {
    console.error(error)
  }
}

async function copyLink(id: string | undefined) {
  if (id === undefined)
    return
  const appUrl = useAppUrl()
  try {
    await useClipboard().toClipboard(`${appUrl}/post/${id}`)
    notification.value = 'copy'
    setTimeout(() => notification.value = '', 800)
  }
  catch (e) {
    console.error(e)
  }
}

async function deleteComment(commentId: string) {
  const res = confirm('Are you sure you want to delete this comment?')
  try {
    if (res && $generalStore.selectedPost)
      await $userStore.deleteComment($generalStore.selectedPost, commentId)
  }
  catch (error) {
    console.error(error)
  }
}

async function addComment() {
  try {
    if ($generalStore.selectedPost)
      await $userStore.addComment($generalStore.selectedPost, comment.value)
    comment.value = ''
    document.getElementById('Comments')?.scroll({ top: 0, behavior: 'smooth' })
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  $generalStore.selectedPost = null

  try {
    await $generalStore.getPostById(route.params.id as string)
    useSeoMeta({
      title: `${selectedPost.value?.title}`,
      ogTitle: `${selectedPost.value?.title}`,
    })
    await $generalStore.getRandomPosts(route.params.id as string)
  }
  catch (error: any) {
    if (error && error.response.status === 400)
      router.push('/')
  }
})

watch(() => comment.value, (com) => {
  if (com.length >= 1000) {
    notification.value = 'com'
    return
  }
  notification.value = ''
})

watch(() => comment.value, (com) => {
  if (input.value) {
    if (com.length >= 800)
      input.value.rows = 5
    else if (com.length >= 600)
      input.value.rows = 4
    else if (com.length >= 400)
      input.value.rows = 3
    else if (com.length >= 200)
      input.value.rows = 2
    else input.value.rows = 1
  }
})
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-row text-white px-[80px] pb-10">
      <div class="flex flex-col w-[1360px]">
        <VideoPlayer :video-url="selectedPost?.videoUrl" />
        <div class="mt-2">
          <div class="text-4xl font-semibold tracking-wider">
            {{ selectedPost?.title }}
          </div>
          <div class="mt-1.5 flex flex-row justify-between">
            <div class="text-gray text-lg">
              views
            </div>
            <div class="flex flex-row">
              <button class="px-3 py-1 bg-gray bg-opacity-60 rounded-full hover:bg-secondary hover:bg-opacity-100" :class="isLiked ? 'border border-solid border-secondary' : ''" @click="() => isLiked ? unlikePost() : likePost()">
                <Icon :name="isLiked ? 'carbon:thumbs-up-filled' : 'carbon:thumbs-up'" class="-mt-1" size="18" />
                <span class="ml-1.5">{{ $generalStore.formatLikes(selectedPost?.likes.length) }}</span>
              </button>
              <button class="ml-3 px-3 py-1 bg-gray bg-opacity-60 rounded-full hover:bg-secondary hover:bg-opacity-100" @click="copyLink(selectedPost?.id)">
                <Icon name="ph:share-fat-fill" class="-mt-1" size="18" />
                <span class="ml-1.5">Share</span>
              </button>
            </div>
          </div>
          <div class="border-b border-gray/40 mt-4 mb-8" />
          <div class="flex flex-col">
            <div class="flex flex-row justify-between">
              <div class="flex flex-row">
                <NuxtLink :to="`/profile/${selectedPost?.user.link}`">
                  <img :src="selectedPost?.user.image" class="w-24 rounded-full mr-4">
                </NuxtLink>
                <div class="flex flex-col mt-1.5">
                  <NuxtLink :to="`/profile/${selectedPost?.user.link}`">
                    <span class="text-2xl font-semibold">{{ selectedPost?.user.name }}</span>
                  </NuxtLink>
                  <span class="mt-[2px] text-xs text-gray">Published on {{ $generalStore.formatDate(selectedPost?.created_at) }}</span>
                </div>
              </div>
              <div v-if="selectedPost?.user.id !== $userStore.id">
                <button
                  v-if="!isFollow"
                  class="flex items-center max-h-[40px] rounded-full py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-secondary hover:bg-secondary/80" @click="actionUser('follow')"
                >
                  Subscribe
                </button>
                <button
                  v-else
                  class="flex text-white border-white item-center max-h-[40px] rounded-full py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray" @click="actionUser('unfollow')"
                >
                  Unsubscribe
                </button>
              </div>
            </div>
            <div class="text-white/60 ml-28 h-max w-[calc(1360px-7rem)]" :class="isShowFullDesc ? 'break-words' : 'overflow-hidden text-ellipsis whitespace-nowrap'">
              {{ selectedPost?.description }}
            </div>
            <div class="items-start ml-28 mt-1">
              <button v-if="!isShowFullDesc" class="text-gray" @click="isShowFullDesc = true">
                Show more
              </button>
              <button v-else class="text-gray" @click="isShowFullDesc = false">
                Show less
              </button>
            </div>
          </div>
        </div>
        <div class="border-b border-gray/40 my-8" />
        <div class="mt-2">
          <span class="text-xl font-semibold text-white/90 mb-5">Comments {{ selectedPost?.comments.length ? selectedPost.comments.length : '' }}</span>
          <Notification :notification-type="notification" />
          <div
            v-if="$userStore.id"
            id="CreateComment"
            class="flex items-center justify-between h-max w-full mt-5 mb-5"
          >
            <div class="flex items-center rounded-lg w-full border-white/40 border">
              <textarea ref="input" v-model="comment" maxlength="1000" cols="30" rows="1" class="resize-none overflow-hidden bg-transparent placeholder-white/40 text-[14px] focus:outline-none w-full p-2 rounded-lg" type="text" placeholder="Add comment..." />
            </div>
            <button class="font-semibold text-sm ml-5 py-1 px-3 rounded-full" :disabled="!comment" :class="comment ? 'bg-secondary cursor-pointer bg-opacity-100 hover:bg-secondary/80' : 'bg-white bg-opacity-10'" @click="() => addComment()">
              Post
            </button>
          </div>
          <div v-if="(selectedPost?.comments.length < 1)" class="text-center mt-6 text-xl text-white/90">
            No comments...
          </div>
          <div
            v-for="com in selectedPost?.comments"
            v-else
            :key="com.id"
            class="flex items-center justify-between mt-4"
          >
            <div class="flex items-center relative w-full">
              <NuxtLink :to="`/profile/${com.user.link}`">
                <img :src="com.user.image" width="40" class="absolute top-0 rounded-full lg:mx-0 mx-auto">
              </NuxtLink>
              <div class="ml-14 pt-0.5 w-full">
                <div class="font-semibold flex items-center justify-between text-[18px]">
                  <NuxtLink :to="`/profile/${com.user.link}`">
                    {{ com.user.name }}
                  </NuxtLink>
                  <Icon v-if="$userStore.id === com.user.id" class="cursor-pointer text-gray hover:text-secondary" size="25" name="ic:round-delete-outline" @click="() => deleteComment(com.id)" />
                </div>
                <div class="font-light text-[15px]">
                  {{ com.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-[365px] pl-[40px]">
        <span class="text-semibold text-xl mb-10">
          Suggested
        </span>
        <div v-for="post in $generalStore.randomPosts" :key="post.id">
          <PostRandom v-if="post" :post="post" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
