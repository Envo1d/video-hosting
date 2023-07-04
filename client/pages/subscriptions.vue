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
    <div class="pt-[80px] w-full grid grid-cols-4">
      <div v-for="post in $generalStore.followingPosts" :key="post.id">
        <PostMain v-if="post" :post="post" />
      </div>
    </div>
  </NuxtLayout>
</template>
