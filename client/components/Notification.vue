<script setup>
const props = defineProps(['notificationType'])
const { notificationType } = toRefs(props)

const notification = ref('')

watch(() => notificationType.value, () => {
  if (notificationType.value === 'copy')
    notification.value = 'Link copied'
  else notification.value = ''
})
</script>

<template>
  <div class="w-[100%] relative flex justify-center">
    <div
      class="absolute top-6 z-50 mx-auto bg-black bg-opacity-70 text-white px-14 py-3 rounded-sm"
      :class="notificationType ? 'visible' : 'invisible'"
    >
      {{ notification }}
    </div>
  </div>
</template>
