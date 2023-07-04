<script setup lang='ts'>
import type { IAuthErrors } from '~/types/api.interface'

const { $userStore, $generalStore } = useNuxtApp()

const email = ref('')
const password = ref('')
const responseError = useState<IAuthErrors>('errors')

async function login() {
  responseError.value = { status: '', errors: [], message: '' }

  try {
    await $userStore.auth('login', { email: email.value, password: password.value })
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
    <div class="text-center text-[28px] mb-4 font-bold text-white/80">
      Log in
    </div>

    <div class="px-6 pb-1.5 text-[15px] text-white/80">
      Email address
    </div>

    <div class="px-6 pb-2">
      <TextInput
        v-model:input="email"
        placeholder="Email address"
        input-type="email"
        :auto-focus="true"
        :error="responseError && responseError?.errors?.find(item => item.path[1] === 'email')?.message || responseError?.message"
      />
    </div>

    <div class="px-6 pb-1.5 text-[15px] text-white/80">
      Password
    </div>
    <div class="px-6 pb-2">
      <TextInput
        v-model:input="password"
        placeholder="Password"
        input-type="password"
        :error="responseError && responseError?.errors?.find(item => item.path[1] === 'password')?.message"
      />
    </div>
    <div class="px-6 text-gray-600 text-[12px] text-white/80">
      Forgot password?
    </div>

    <div class="px-6 pb-2 mt-6">
      <button
        :disabled="!email || !password"
        :class="(!email || !password) ? 'bg-primary' : 'bg-secondary'"
        class="w-full font-semibold text-white py-3 rounded-sm text-[17px]"
        @click="() => login()"
      >
        Log in
      </button>
    </div>
  </section>
</template>

function useNuxtApp(): { $userStore: any; $generalStore: any } {
  throw new Error('Function not implemented.')
}
