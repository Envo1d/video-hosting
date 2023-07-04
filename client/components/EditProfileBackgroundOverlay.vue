<script setup>
const { $userStore, $generalStore, $profileStore } = useNuxtApp()

const errorType = ref(null)
const icon = ref(null)
const iconDisplay = ref(null)
const iconData = ref(null)
const isUploading = ref(false)

function onDropIcon(e) {
  errorType.value = ''
  icon.value = e.dataTransfer.files[0]
  iconData.value = e.dataTransfer.files[0]

  const extension = file.value.name.substring(file.value.name.lastIndexOf('.') + 1)

  if (extension !== 'jpg' || extension !== 'png' || extension !== 'jpeg') {
    errorType.value = 'icon'
    return
  }

  iconDisplay.value = URL.createObjectURL(e.dataTransfer.files[0])
}

function clearIcon() {
  icon.value = null
  iconDisplay.value = null
  iconData.value = null
}

function onChangeIcon() {
  iconDisplay.value = URL.createObjectURL(icon.value.files[0])
  iconData.value = icon.value.files[0]
}

function discard() {
  icon.value = null
  iconDisplay.value = null
  iconData.value = null
  $generalStore.isEditProfileBackOpen = false
}

async function update() {
  const data = new FormData()

  data.append('file', iconData.value || '')

  if (iconData.value)
    isUploading.value = true

  try {
    const res = await $userStore.updateUserBackImage(data)
    if (res.status === 200) {
      await $userStore.getUser()
      await $profileStore.getProfile($userStore.id)
      $generalStore.isEditProfileBackOpen = false
    }
  }
  catch (err) {
    isUploading.value = false
  }
}
</script>

<template>
  <div
    id="EditProfileBackgroundOverlay"
    class="fixed justify-center pt-14 md:pt-[105px] z-50 top-0 left-[30%] w-full h-full bg-main bg-opacity-50 overflow-auto"
  >
    <Notification :notification-type="errorType" />
    <div
      v-if="isUploading"
      class="fixed flex items-center justify-center top-0 left-0 w-full h-screen bg-black z-50 bg-opacity-50"
    >
      <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#fff" />
    </div>
    <div
      class="relative bg-main border border-solid border-secondary w-full max-w-[700px] sm:h-[580px] h-[655px] mx-3 p-4 rounded-lg mb-10"
    >
      <div class="absolute flex items-center justify-between w-full p-5 left-0 top-0 border-b border-b-gray">
        <div class="font-medium text-[22px] text-white">
          Edit profile background
        </div>
        <button @click="() => discard()">
          <Icon size="25" name="mdi:close" color="#fff" />
        </button>
      </div>

      <div class="h-[calc(500px-200px)] mt-[58px] text-white flex flex-col items-center justify-center pt-10">
        <label
          v-if="!iconDisplay"
          for="iconInput"
          class="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[470px] h-[260px] text-center p-3 border-2 border-dashed border-gray rounded-lg hover:bg-gray/10 cursor-pointer"
          @drop.prevent="onDropIcon"
          @dragover.prevent
        >
          <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1" />
          <div class="mt-4 text-[17px]">Select image</div>
          <div class="mt-1.5 text-[13px]">Or drag and drop a file</div>
          <div class="mt-12 text-sm">JPG, JPEG, PNG</div>
          <div class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-secondary rounded-sm hover:bg-secondary/80">
            Select file
          </div>
          <input id="iconInput" ref="icon" type="file" hidden accept=".jpg, .jpeg, .png" @input="onChangeIcon">
        </label>

        <div
          v-else
          class="md:mx-0 mx-auto mt-4 md:mb-12 mb-16 flex items-center justify-center w-full max-w-[540px] h-[260px] p-3 rounded-2xl cursor-pointer relative border-2 border-gray border-dashed"
        >
          <div class="bg-[#000] h-full w-full rounded-lg" />

          <img :src="iconDisplay" class="absolute z-10 p-[13px] w-full h-full rounded-lg">

          <div class="absolute -bottom-12 flex items-center justify-between z-50 rounded-xl border w-full p-2 border-gray">
            <div class="flex items-center truncate">
              <Icon size="16" class="min-w-[16px]" name="clarity:success-standard-line" />
              <div class="pl-1 truncate text-ellipsis text-[11px]">
                {{ iconData.name }}
              </div>
            </div>
            <button class="text-[11px] ml-2 font-semibold" @click="clearIcon">
              Change
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-10">
        <button :disabled="!iconDisplay" class="py-1 px-3 rounded-full disabled:bg-gray bg-secondary text-white hover:bg-secondary/80" @click="update">
          Update
        </button>
      </div>
    </div>
  </div>
</template>
