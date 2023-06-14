<script setup>
const email = ref(null)
const name = ref(null)
const password = ref(null)
const confirmPassword = ref(null)
const errors = ref(null)
function register() {}
</script>

<template>
  <section>
    <div class="text-center text-[28px] mb-4 font-bold">
      Sign up
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="name"
        placeholder="Full name"
        input-type="text"
        :auto-focus="true"
        error=""
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="email"
        placeholder="Email address"
        input-type="email"
        error=""
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="password"
        placeholder="Password"
        input-type="password"
        error=""
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="confirmPassword"
        placeholder="Confirm password"
        input-type="password"
        error=""
      />
    </div>

    <div class="px-6 pb-2 mt-6">
      <button
        :disabled="!email || !password || !name || !confirmPassword"
        :class="(!email || !password || !name || !confirmPassword) ? 'bg-gray-200' : 'bg-[#f02c56]'"
        class="w-full font-semibold text-white py-3 rounded-sm text-[17px]"
        @click="$event => register()"
      >
        Sign up
      </button>
    </div>
  </section>
</template>
