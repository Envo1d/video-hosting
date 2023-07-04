<script setup>
const isRegister = ref(true)
const { $generalStore } = useNuxtApp()
</script>

<template>
  <div
    id="AuthOverlay"
    class="fixed flex border items-center justify-center z-50 top-0 left-0 w-full h-full bg-white bg-opacity-20"
  >
    <div class="relative bg-main border border-secondary border-solid w-full max-w-[470px] h-max p-4 rounded-lg">
      <div class="w-full flex justify-end">
        <button
          class="p-1.5 rounded-full bg-gray-100"
          @click="() => $generalStore.isLoginOpen = false"
        >
          <Icon size="26" class="text-white/80" name="mdi:close" />
        </button>
      </div>

      <Login v-if="isRegister" />
      <Register v-else />

      <div class="flex items-center justify-center py-5 left-0 bottom-0 w-full">
        <span v-if="isRegister" class="text-gray text-[14px]">Don't have an account?</span>
        <span v-else class="text-gray text-[14px]">Already have an account?</span>
        <button class="font-semibold pl-1 text-secondary text-[14px]" @click="() => isRegister = !isRegister">
          <span v-if="isRegister">Sign up</span>
          <span v-else>Log in</span>
        </button>
      </div>
    </div>
  </div>
</template>
