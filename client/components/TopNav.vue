<script setup>
import { storeToRefs } from 'pinia'

const { $userStore, $generalStore } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const showMenu = ref(false)
const { image } = storeToRefs($userStore)

onMounted(() => {
  document.addEventListener('mouseup', (e) => {
    const popupMenu = document.getElementById('PopupMenu')
    if (popupMenu !== null && !popupMenu.contains(e.target))
      showMenu.value = false
  })
})

watch(image, () => {})

function isLoggedIn() {
  if ($userStore.id)
    router.push('/upload')
  else $generalStore.isLoginOpen = true
}

function logout() {
  try {
    $userStore.logout()
    showMenu.value = false
    if (route.path.includes('/post'))
      return
    if (route.path.includes('/profile'))
      return
    router.push('/')
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div id="TopNav" class="fixed bg-main z-30 flex items-center w-full h-[61px]">
    <div
      class="flex items-center justify-between w-full px-6 mx-auto"
    >
      <div class="lg:w-[20%] w-[50%]">
        <NuxtLink to="/">
          <span class="text-white/80 hover:text-white text-xl font-semibold">Logo</span>
        </NuxtLink>
      </div>

      <div class="hidden md:flex items-center bg-[#EBEBEB]/10 p-1 rounded-full max-w-[830px] w-full max-h-[44px]">
        <input
          type="text" class="w-full pl-3 my-2 bg-transparent placeholder-white/40 text-[15px] focus:outline-none text-white/80"
          placeholder="Search"
        >
        <div class="px-3 py-1 flex items-center">
          <Icon name="ri:search-line" color="#ffffff" size="22" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 min-w-[275px] max-w-[320px] w-full">
        <button
          class="flex items-center rounded-2xl px-3 py-[6px] hover:bg-secondary"
          @click="() => isLoggedIn()"
        >
          <Icon name="ic:round-file-upload" color="#fff" size="22" />
        </button>

        <div v-if="!$userStore.id" class="flex items-center">
          <button
            class="flex items-center rounded-2xl px-3 py-[6px] hover:bg-secondary"
            @click="() => $generalStore.isLoginOpen = true"
          >
            <Icon name="ion:log-in-outline" color="#fff" size="25" />
          </button>
        </div>

        <div v-else class="flex items-center">
          <button
            class="flex items-center rounded-2xl mr-5 px-3 py-[6px] hover:bg-secondary"
          >
            <Icon color="#fff" size="22" name="ion:notifications-outline" />
          </button>

          <div class="relative">
            <button class="mt-1" @click="() => showMenu = !showMenu">
              <img :src="image" class="rounded-full" width="33">
            </button>

            <div
              v-if="showMenu" id="PopupMenu"
              class="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl top-[43px] -right-2"
            >
              <NuxtLink
                class="flex items-center justify-start py-3 px-2 hover:text-secondary cursor-pointer"
                :to="`/profile/${$userStore.link}`"
                @click="() => showMenu = false"
              >
                <Icon name="ph:user" size="22" />
                <span class="pl-2 font-semibold text-sm">Profile</span>
              </NuxtLink>
              <div
                class="flex items-center justify-start py-3 px-1.5 hover:text-secondary border-t cursor-pointer"
                @click="() => logout()"
              >
                <Icon name="ion:log-out-outline" class="ml-1" size="22" />
                <span class="pl-1.5 font-semibold text-sm">Log out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
