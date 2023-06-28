<script setup>
const { $generalStore } = useNuxtApp()

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Following Page',
  ogTitle: 'Following Page',
})

onMounted(async () => {
  try {
    await $generalStore.getAllFollowingUsersAndPosts()
  }
  catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <NuxtLayout>
    <div class="pt-[80px] w-[calc(100%-90px)] max-w-[690px]">
      <div v-for="post in $generalStore.followingPosts" :key="post.id">
        <PostMain v-if="post" :post="post" />
      </div>
    </div>
  </NuxtLayout>
</template>
