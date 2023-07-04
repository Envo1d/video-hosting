<script setup>
const props = defineProps(['input', 'placeholder', 'inputType', 'max', 'autoFocus', 'error'])

const emit = defineEmits(['update:input'])

const { input, placeholder, inputType, max, autoFocus, error } = toRefs(props)

onMounted(() => {
  if (autoFocus.value)
    document.getElementById(`input-${placeholder.value}`).focus()
})

const inputComputed = computed({
  get: () => input.value,
  set: val => emit('update:input', val),
})
</script>

<template>
  <div>
    <input
      :id="`input-${placeholder}`"
      v-model="inputComputed"
      class="block w-full bg-transparent text-white/80 border border-gray rounded-md py-2.5 px-3 focus:outline-none"
      :placeholder="placeholder"
      :type="inputType"
      autocomplete="off"
      :maxlength="max"
    >

    <span v-if="error" class="text-red-500 text-[14px] font-semibold">{{ error }}</span>
  </div>
</template>
