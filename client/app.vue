<script setup>
import { storeToRefs } from 'pinia'

const { $generalStore, $userStore } = useNuxtApp()
const { isLoginOpen, isEditProfileOpen, isEditProfileBackOpen } = storeToRefs($generalStore)

onMounted(async () => {
  $generalStore.bodySwitch(false)
  isLoginOpen.value = false
  isEditProfileOpen.value = false
  isEditProfileBackOpen.value = false

  try {
    await $generalStore.hasSessionExpired()
    if ($userStore.id)
      await $generalStore.getRandomUsers()

    if ($userStore.id)
      $userStore.getUser()
  }
  catch (error) { console.error(error) }
})

watch(() => isLoginOpen.value, val => $generalStore.bodySwitch(val))
watch(() => isEditProfileOpen.value, val => $generalStore.bodySwitch(val))
watch(() => isEditProfileBackOpen.value, val => $generalStore.bodySwitch(val))
watch(() => $userStore.id, async () => {
  try {
    if ($userStore.id)
      await $generalStore.getRandomUsers()

    if ($userStore.id)
      $userStore.getUser()
  }
  catch (error) { console.error(error) }
})
</script>

<template>
  <div>
    <NuxtPage />

    <AuthOverlay v-if="isLoginOpen" />
    <EditProfileOverlay v-if="isEditProfileOpen" />
    <EditProfileBackgroundOverlay v-if="isEditProfileBackOpen" />
  </div>
</template>
