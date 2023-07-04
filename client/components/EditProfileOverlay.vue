<script setup>
import { storeToRefs } from 'pinia'
import { CircleStencil, Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const { $userStore, $generalStore, $profileStore } = useNuxtApp()
const { name, bio, image } = storeToRefs($userStore)

const route = useRoute()

const uploadedImage = ref(null)
const userName = ref(null)
const userBio = ref(null)
const file = ref(null)
const cropper = ref(null)
const userImage = ref(null)
const isUpdated = ref(false)

onMounted(() => {
  userName.value = name.value
  userBio.value = bio.value
  userImage.value = image.value
})

function getUploadedImage(e) {
  file.value = e.target.files[0]
  uploadedImage.value = URL.createObjectURL(file.value)
}

async function cropAndUpdateImage() {
  const { coordinates } = cropper.value.getResult()

  const data = new FormData()
  data.append('file', file.value || '')
  data.append('height', coordinates.height || 0)
  data.append('width', coordinates.width || 0)
  data.append('top', coordinates.top || 0)
  data.append('left', coordinates.left || 0)

  try {
    await $userStore.updateUserImage(data)
    await $userStore.getUser()
    await $profileStore.getProfile(route.params.id)

    $generalStore.updateSideMenuImage($generalStore.suggested, $userStore)
    $generalStore.updateSideMenuImage($generalStore.following, $userStore)

    userImage.value = image.value
    uploadedImage.value = null
  }
  catch (error) {
    console.error(error)
  }
}

async function updateUserInfo() {
  try {
    await $userStore.updateUser(userName.value, userBio.value)
    await $userStore.getUser()
    await $profileStore.getProfile(route.params.id)

    userName.value = name.value
    userBio.value = bio.value

    setTimeout(() => {
      $generalStore.isEditProfileOpen = false
    }, 100)
  }
  catch (error) {
    console.error(error)
  }
}

watch(() => userName.value, () => {
  if (!userName.value || userName.value === name.value)
    isUpdated.value = false
  else isUpdated.value = true
})

watch(() => userBio.value, () => {
  if (!userName.value || userBio.value.length < 1)
    isUpdated.value = false
  else isUpdated.value = true
})
</script>

<template>
  <div
    id="EditProfileOverlay"
    class="fixed flex justify-center pt-14 md:pt-[105px] z-50 top-0 left-0 w-full h-full bg-main bg-opacity-50 overflow-auto"
  >
    <div
      :class="!uploadedImage ? 'h-[655px]' : 'h-[580px]'"
      class="relative bg-main border border-solid border-secondary w-full max-w-[700px] sm:h-[580px] h-[655px] mx-3 p-4 rounded-lg mb-10"
    >
      <div class="absolute flex items-center justify-between w-full p-5 left-0 top-0 border-b border-b-gray">
        <div class="font-medium text-[22px] text-white">
          Edit profile
        </div>
        <button @click="() => $generalStore.isEditProfileOpen = false">
          <Icon size="25" name="mdi:close" color="#fff" />
        </button>
      </div>

      <div class="h-[calc(500px-200px)]" :class="!uploadedImage ? 'mt-16' : 'mt-[58px]'">
        <div v-if="!uploadedImage">
          <div
            id="ProfilePhotoSection"
            class="flex flex-col border-b border-gray sm:h-[118px] h-[145px] px-1.5 py-2 w-full"
          >
            <div class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center text-white">
              Profile photo
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <label for="image" class="relative cursor-pointer">
                <img
                  class="rounded-full"
                  width="95"
                  :src="userImage"
                >
                <div class="absolute bottom-0 right-0 rounded-full bg-white shadow-xl border p-1 border-gray-300 inline-block w-[32px]">
                  <Icon size="17" class="-mt-1 ml-0.5" name="ph:pencil-simple-line-bold" />
                </div>
              </label>
              <input
                id="image"
                class="hidden"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                @input="getUploadedImage"
              >
            </div>
          </div>

          <div
            id="UsernameSection"
            class="flex flex-col border-b border-gray sm:h-[118px] px-1.5 py-2 mt-1.5 w-full"
          >
            <div class="font-semibold text-[15px] sm:mb-0 mb-1 sm:w-[160px] sm:text-left text-center text-white">
              Username
            </div>

            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <TextInput
                  v-model:input="userName"
                  placeholder="Username"
                  input-type="text"
                  max="30"
                />
                <div class="text-[11px] text-gray-500 mt-4 text-white">
                  Usernames can only contain letters, numbers, underscores, and peridots.
                  Changing your username will also change your profile link.
                </div>
              </div>
            </div>
          </div>

          <div
            id="BioSection"
            class="flex flex-col sm:h-[120px] px-1.5 py-2 mt-2 w-full"
          >
            <div class="font-semibold text-[15px] sm:mb-0 mb-1 sm:w-[160px] sm:text-left text-center text-white">
              Bio
            </div>
            <div class="flex items-center justify-center sm:-mt-6">
              <div class="sm:w-[60%] w-full max-w-md">
                <textarea
                  v-model="userBio"
                  cols="30"
                  rows="4"
                  maxlength="80"
                  class="resize-none w-full bg-transparent text-white/80 border border-gray rounded-md py-2.5 px-3 focus:outline-none"
                />
                <div v-if="userBio" class="text-[11px] text-white">
                  {{ userBio.length }}/80
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="w-full h-[430px]">
          <Cropper
            ref="cropper"
            class="h-430px"
            :stencil-component="CircleStencil"
            :src="uploadedImage"
          />
        </div>
      </div>
      <div
        id="ButtonSection"
        class="absolute p-5 left-0 bottom-0 border-t border-t-gray w-full"
      >
        <div
          v-if="!uploadedImage"
          id="UpdateInfoButtons"
          class="flex items-center justify-end"
        >
          <button
            class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray text-white"
            @click="() => $generalStore.isEditProfileOpen = false"
          >
            <span class="px-2 font-medium text-[15px]">Cancel</span>
          </button>

          <button
            class="flex items-center text-white border rounded-ms ml-3 px-3 py-[6px]"
            :disabled="!isUpdated"
            :class="!isUpdated ? 'bg-gray' : 'bg-secondary hover:bg-primary'"
            @click="updateUserInfo()"
          >
            <span class="mx-4 font-medium text-[15px]">Apply</span>
          </button>
        </div>

        <div
          v-else
          id="CropperButtons"
          class="flex items-center justify-end"
        >
          <button
            class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray text-white"
            @click="() => uploadedImage = null"
          >
            <span class="px-2 font-medium text-[15px]">Cancel</span>
          </button>

          <button
            class="flex items-center bg-secondary hover:bg-primary text-white border rounded-ms ml-3 px-3 py-[6px]"
            @click="cropAndUpdateImage()"
          >
            <span class="mx-4 font-medium text-[15px]">Apply</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
