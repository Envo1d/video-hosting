<script setup lang='ts'>
const { $generalStore } = useNuxtApp()

useSeoMeta({
  title: 'Home Page',
  ogTitle: 'Home Page',
})

onMounted(async () => {
  try {
    await $generalStore.getAllUsersAndPosts()
  }
  catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <NuxtLayout>
    <div class="pt-[80px] w-full grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-1">
      <div v-for="post in $generalStore.posts" :key="post.id">
        <PostMain v-if="post" :post="post" />
      </div>
    </div>
  </NuxtLayout>
</template>
