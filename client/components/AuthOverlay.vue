<script setup>
const isRegister = ref(true)
</script>

<template>
  <div
    id="AuthOverlay"
    class="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
  >
    <div class="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg">
      <div class="w-full flex justify-end">
        <button class="p-1.5 rounded-full bg-gray-100">
          <Icon size="26" name="mdi:close" />
        </button>
      </div>

      <Login v-if="isRegister" />
      <Register v-else />

      <div class="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
        <span v-if="isRegister" class="text-gray-600 text-[14px]">Don't have an account?</span>
        <span v-else class="text-gray-600 text-[14px]">Already have an account?</span>
        <button class="font-semibold pl-1 text-[#f02c56] text-[14px]" @click="$event => isRegister = !isRegister">
          <span v-if="isRegister">Sign up</span>
          <span v-else>Log in</span>
        </button>
      </div>
    </div>
  </div>
</template>
