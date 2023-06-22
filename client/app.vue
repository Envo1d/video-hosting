<script setup>
import { storeToRefs } from 'pinia'

const { $generalStore, $userStore } = useNuxtApp()
const { isLoginOpen, isEditProfileOpen } = storeToRefs($generalStore)

onMounted(async () => {
  $generalStore.bodySwitch(false)
  isLoginOpen.value = false
  isEditProfileOpen.value = false

  try {
    await $generalStore.hasSessionExpired()
    await $generalStore.getRandomUsers()

    if ($userStore.id)
      $userStore.getUser()
  }
  catch (error) { console.error(error) }
})

watch(() => isLoginOpen.value, val => $generalStore.bodySwitch(val))
watch(() => isEditProfileOpen.value, val => $generalStore.bodySwitch(val))
</script>

<template>
  <div>
    <NuxtPage />

    <AuthOverlay v-if="isLoginOpen" />
    <EditProfileOverlay v-if="isEditProfileOpen" />
  </div>
</template>
