<script setup>
const props = defineProps(['notificationType'])
const { notificationType } = toRefs(props)

const notification = ref('')

watch(() => notificationType.value, () => {
  if (notificationType.value === 'copy')
    notification.value = 'Link copied'
  else if (notificationType.value === 'caption')
    notification.value = 'Maximum 100 characters.'
  else if (notificationType.value === 'com')
    notification.value = 'Maximum 1000 characters.'
  else if (notificationType.value === 'description')
    notification.value = 'Maximum 5000 characters.'
  else if (notificationType.value === 'bio')
    notification.value = 'Maximum 80 characters.'
  else if (notificationType.value === 'file')
    notification.value = 'Unsupported file. Use MP4 instead.'
  else if (notificationType.value === 'icon')
    notification.value = 'Unsupported file. Use JPEG, JPG, PNG instead.'
  else notification.value = ''
})
</script>

<template>
  <div class="w-[100%] relative flex justify-center">
    <div
      class="absolute top-6 z-50 mx-auto bg-[#141414] bg-opacity-70 border-secondary/50 border text-white px-14 py-3 rounded-xl"
      :class="notificationType ? 'visible' : 'invisible'"
    >
      {{ notification }}
    </div>
  </div>
</template>
