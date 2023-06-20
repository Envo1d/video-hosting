<script setup lang='ts'>
import type { IAuthErrors } from '~/types/api.interface'

const { $userStore, $generalStore } = useNuxtApp()

const email = ref('')
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const responseError = useState<IAuthErrors>('errors')
async function register() {
  responseError.value = { status: '', errors: [] }

  try {
    await $userStore.auth('register', {
      email: email.value,
      password: password.value,
      name: name.value,
      passwordConfirm: confirmPassword.value,
    })
    await $userStore.getUser()

    $generalStore.isLoginOpen = false
  }
  catch (error: any) {
    responseError.value = error.response.data
  }
}
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
        :error="responseError && responseError?.errors?.find(item => item.path[1] === 'name')?.message"
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="email"
        placeholder="Email address"
        input-type="email"
        :error="responseError && responseError?.errors?.find(item => item.path[1] === 'email')?.message"
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="password"
        placeholder="Password"
        input-type="password"
        :error="responseError && responseError?.errors?.find(item => item.path[1] === 'password')?.message"
      />
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="confirmPassword"
        placeholder="Confirm password"
        input-type="password"
        :error="responseError && responseError?.errors?.find(item => item.path[1] === 'passwordConfirm')?.message"
      />
    </div>

    <div class="px-6 pb-2 mt-6">
      <button
        :disabled="!email || !password || !name || !confirmPassword"
        :class="(!email || !password || !name || !confirmPassword) ? 'bg-gray-200' : 'bg-[#f02c56]'"
        class="w-full font-semibold text-white py-3 rounded-sm text-[17px]"
        @click="() => register()"
      >
        Sign up
      </button>
    </div>
  </section>
</template>
