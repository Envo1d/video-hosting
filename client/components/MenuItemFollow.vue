<script setup>
defineProps(['user'])
</script>

<template>
  <div class="flex items-center hover:bg-gray-100 rounded-md w-full py-1.5 mb-[23px]">
    <img v-if="user.image" :src="user.image" width="26" class="rounded-full lg:mx-0 mx-auto">
    <div class="lg:pl-2.5 lg:block hidden">
      <div class="flex items-center">
        <div class="font-normal text-[16px] text-gray">
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>
