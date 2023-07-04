<script setup>
const props = defineProps(['iconString', 'colorString', 'sizeString', 'iconName'])
const { iconString, colorString, sizeString, iconName } = toRefs(props)
</script>

<template>
  <div class="w-full flex items-center hover:text-secondary rounded-md mt-[28px]" :class="`text-${colorString}`">
    <div class="flex items-center lg:mx-0 mx-auto">
      <Icon :name="iconName" :size="sizeString" />
      <span class="lg:block hidden ml-1.5 mt-0.5 font-semibold text-[16px]">{{
        iconString }}</span>
    </div>
  </div>
</template>
