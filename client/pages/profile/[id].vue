<script setup>
import { storeToRefs } from 'pinia'

const { $generalStore, $profileStore, $userStore } = useNuxtApp()

const { posts, allLikes, name } = storeToRefs($profileStore)

const route = useRoute()

const show = ref(false)

const isFollow = computed(() => {
  if ($userStore.id) {
    const res = $userStore.subscriptions.includes(route.params.id)

    if (res)
      return true
    return false
  }
  return false
})

onMounted(async () => {
  try {
    await $profileStore.getProfile(route.params.id)
    useSeoMeta({
      title: `${name.value} Profile`,
      ogTitle: `${name.value} Profile`,
    })
  }
  catch (error) {
    console.error(error)
  }
})

async function actionUser(type) {
  try {
    if (type === 'follow')
      await $userStore.follow(route.params.id)
    else await $userStore.unfollow(route.params.id)
    await $userStore.getUser()
    await $generalStore.getRandomUsers()
    await $profileStore.getProfile(route.params.id)
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  try {
    await $profileStore.getProfile(route.params.id)
  }
  catch (error) {
    console.error(error)
  }
})

watch(() => posts.value, () => {
  setTimeout(() => show.value = true, 300)
})
</script>

<template>
  <NuxtLayout>
    <div
      v-if="$profileStore.name"
      class="pt-[90px] lg:pr-0 pr-2 w-full 2xl:mx-auto"
    >
      <div class="bg-primary w-[calc(90vw-150px)] hidden lg:flex overflow-hidden rounded-xl h-[280px] max-h-[280px] mb-10">
        <button v-if="$profileStore.id === $userStore.id" class="absolute mt-5 ml-10 h-min" @click="() => $generalStore.isEditProfileBackOpen = true">
          <Icon name="mdi:pencil" class="text-white text-opacity-30 hover:text-opacity-100" size="18" />
        </button>
        <img v-if="$profileStore.backgroundImage" class="w-full" :src="$profileStore.backgroundImage">
      </div>
      <div class="flex w-[calc(90vw-150px)]">
        <img :src="$profileStore.image" class="max-w-[80px] max-h-[80px] rounded-full">

        <div class="ml-5 w-full">
          <div class="text-[30px] font-semibold truncate text-white">
            {{ $profileStore.name }}
          </div>
          <div class="truncate text-[18px] text-white">
            {{ $profileStore.name }}
          </div>
        </div>
        <div>
          <button
            v-if="$profileStore.id === $userStore.id"
            class="flex flex-row item-center rounded-md py-1.5 max-h-[40px] px-3.5 mt-3 text-[15px] w-max font-semibold border border-white text-white hover:bg-gray"
            @click="() => $generalStore.isEditProfileOpen = true"
          >
            <Icon class="mt-0.5 mr-1" name="mdi:pencil" size="18" />
            <div>Edit profile</div>
          </button>
          <div v-else>
            <button
              v-if="!isFollow"
              class="flex items-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-secondary hover:bg-secondary/80" @click="actionUser('follow')"
            >
              Follow
            </button>
            <button
              v-else
              class="flex text-white border-white item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray" @click="actionUser('unfollow')"
            >
              Unfollow
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center pt-4 text-white">
        <div class="mr-4">
          <span class="font-bold">{{ $profileStore.following }}</span>
          <span class="font-light text-[15px] pl-1.5">Following</span>
        </div>
        <div class="mr-4">
          <span class="font-bold">{{ $profileStore.followers }}</span>
          <span class="font-light text-[15px] pl-1.5">Followers</span>
        </div>
        <div class="mr-4">
          <span class="font-bold">{{ allLikes }}</span>
          <span class="font-light text-[15px] pl-1.5">Likes</span>
        </div>
      </div>

      <div class="text-white pt-4 mr-4 font-light text-[15px] pl-1.5 max-w-[500px]">
        {{ $profileStore.bio }}
      </div>

      <div class="w-full flex items-center pt-4 text-white">
        <div class="w-60 text-center py-2 text-[17px]">
          Home
        </div>
        <div class="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">
          Videos
        </div>
        <div class="w-60 text-gray-500 text-center py-2 text-[17px]">
          <Icon class="mb-0.5" name="material-symbols:lock-open" /> Liked
        </div>
      </div>

      <div v-if="show" class="mt-4 grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <div v-for="post in $profileStore.posts" :key="post.id">
          <PostUser :post="post" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
