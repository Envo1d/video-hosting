<script setup>
const email = ref(null)
const password = ref(null)
const errors = ref(null)
function login() {}
</script>

<template>
  <section>
    <div class="text-center text-[28px] mb-4 font-bold">
      Log in
    </div>

    <div class="px-6 pb-1.5 text-[15px]">
      Email address
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="email"
        placeholder="Email address"
        input-type="email"
        :auto-focus="true"
        error=""
      />
    </div>

    <div class="px-6 pb-1.5 text-[15px]">
      Password
    </div>
    <div class="px-6 pb-2">
      <TextInput
        v-model:input="password"
        placeholder="Password"
        input-type="password"
        error=""
      />
    </div>
    <div class="px-6 text-gray-600 text-[12px]">
      Forgot password?
    </div>

    <div class="px-6 pb-2 mt-6">
      <button
        :disabled="!email || !password"
        :class="(!email || !password) ? 'bg-gray-200' : 'bg-[#f02c56]'"
        class="w-full font-semibold text-white py-3 rounded-sm text-[17px]"
        @click="$event => login()"
      >
        Log in
      </button>
    </div>
  </section>
</template>
