<script setup>
const { $userStore } = useNuxtApp()
const layout = 'upload'
const file = ref(null)
const fileDisplay = ref(null)
const icon = ref(null)
const iconDisplay = ref(null)
const errorType = ref(null)
const caption = ref('')
const description = ref('')
const fileData = ref(null)
const iconData = ref(null)
const error = ref(null)
const isUploading = ref(false)
const router = useRouter()

useSeoMeta({
  title: 'Upload Page',
  ogTitle: 'Upload Page',
})

definePageMeta({ middleware: 'auth' })

const isFilled = computed(() => {
  if (caption.value.length === 0 || description.value.length === 0 || fileData.value === null || iconData.value === null)
    return false
  return true
})

watch(() => caption.value, (caption) => {
  if (caption.length >= 100) {
    errorType.value = 'caption'
    return
  }
  errorType.value = null
})

watch(() => description.value, (description) => {
  if (description.length >= 5000) {
    errorType.value = 'description'
    return
  }
  errorType.value = null
})

function onDrop(e) {
  errorType.value = ''
  file.value = e.dataTransfer.files[0]
  fileData.value = e.dataTransfer.files[0]

  const extension = file.value.name.substring(file.value.name.lastIndexOf('.') + 1)

  if (extension !== 'mp4') {
    errorType.value = 'file'
    return
  }

  fileDisplay.value = URL.createObjectURL(e.dataTransfer.files[0])
}

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

function onChange() {
  fileDisplay.value = URL.createObjectURL(file.value.files[0])
  fileData.value = file.value.files[0]
}

function onChangeIcon() {
  iconDisplay.value = URL.createObjectURL(icon.value.files[0])
  iconData.value = icon.value.files[0]
}

function discard() {
  file.value = null
  fileDisplay.value = null
  fileData.value = null
  caption.value = ''
  description.value = ''
  icon.value = null
  iconDisplay.value = null
  iconData.value = null
}

async function createPost() {
  error.value = null

  const data = new FormData()

  data.append('file', fileData.value || '')
  data.append('title', caption.value || '')
  data.append('description', description.value || '')
  data.append('icon', iconData.value || '')

  if (fileData.value && caption.value && description.value && iconData.value)
    isUploading.value = true

  try {
    const res = await $userStore.createPost(data)
    if (res.status === 200) {
      setTimeout(() => {
        isUploading.value = false
        router.push(`/profile/${$userStore.link}`)
      }, 1000)
    }
  }
  catch (err) {
    error.value = err.response.data.message
    isUploading.value = false
  }
}

function clearVideo() {
  file.value = null
  fileDisplay.value = null
  fileData.value = null
}

function clearIcon() {
  icon.value = null
  iconDisplay.value = null
  iconData.value = null
}
</script>

<template>
  <section>
    <Notification :notification-type="errorType" />

    <div
      v-if="isUploading"
      class="fixed flex items-center justify-center top-0 left-0 w-full h-screen bg-black z-50 bg-opacity-50"
    >
      <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#fff" />
    </div>

    <NuxtLayout :name="layout">
      <div class="w-full mt-[80px] mb-[40px] bg-main text-white border border-solid border-secondary rounded-md py-6 md:px-10 px-4">
        <div>
          <div class="text-[23px] font-semibold">
            Upload video
          </div>
          <div class="text-gray mt-1">
            Post a video to your account
          </div>
        </div>

        <div class="mt-8 gap-6 md:flex">
          <div class="flex flex-col w-[calc(100vw-70%)]">
            <label
              v-if="!fileDisplay"
              for="fileInput"
              class="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[470px] h-[260px] text-center p-3 border-2 border-dashed border-gray rounded-lg hover:bg-gray/10 cursor-pointer"
              @drop.prevent="onDrop"
              @dragover.prevent
            >
              <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1" />
              <div class="mt-4 text-[17px]">Select video to upload</div>
              <div class="mt-1.5 text-[13px]">Or drag and drop a file</div>
              <div class="mt-12 text-sm">MP4</div>
              <div class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-secondary rounded-sm hover:bg-secondary/80">
                Select file
              </div>
              <input id="fileInput" ref="file" type="file" hidden accept=".mp4" @input="onChange">
            </label>

            <div
              v-else
              class="md:mx-0 mx-auto mt-4 md:mb-12 mb-16 flex items-center justify-center w-full max-w-[540px] h-[260px] p-3 rounded-2xl cursor-pointer relative border-2 border-gray border-dashed"
            >
              <div class="bg-[#000] h-full w-full rounded-lg" />

              <video :src="fileDisplay" autoplay loop muted class="absolute z-10 p-[13px] w-full h-full rounded-lg" />

              <div class="absolute -bottom-12 flex items-center justify-between z-50 rounded-xl border w-full p-2 border-gray-300">
                <div class="flex items-center truncate">
                  <Icon size="16" class="min-w-[16px]" name="clarity:success-standard-line" />
                  <div class="pl-1 truncate text-ellipsis text-[11px]">
                    {{ fileData.name }}
                  </div>
                </div>
                <button class="text-[11px] ml-2 font-semibold" @click="clearVideo">
                  Change
                </button>
              </div>
            </div>

            <label
              v-if="!iconDisplay"
              for="iconInput"
              class="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[470px] h-[260px] text-center p-3 border-2 border-dashed border-gray rounded-lg hover:bg-gray/10 cursor-pointer"
              @drop.prevent="onDropIcon"
              @dragover.prevent
            >
              <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1" />
              <div class="mt-4 text-[17px]">Select video icon</div>
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

              <div class="absolute -bottom-12 flex items-center justify-between z-50 rounded-xl border w-full p-2 border-gray-300">
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

          <div class="mb-6 w-full">
            <div class="mt-5">
              <div class="flex items-center justify-between">
                <div class="mb-1 text-[15px]">
                  Title
                </div>
                <div class="text-[12px]">
                  {{ caption.length }}/100
                </div>
              </div>
              <input v-model="caption" type="text" maxlength="100" class="w-full border border-gray bg-transparent p-2.5 rounded-md focus:outline-none">
            </div>

            <div class="mt-5">
              <div class="flex items-center justify-between">
                <div class="mb-1 text-[15px]">
                  Description
                </div>
                <div class="text-gray-400 text-[12px]">
                  {{ description.length }}/5000
                </div>
              </div>
              <textarea
                v-model="description"
                cols="30"
                rows="18"
                maxlength="5000"
                class="resize-none w-full bg-transparent text-white border border-gray rounded-md py-2.5 px-3 focus:outline-none"
              />
            </div>

            <div class="flex gap-3">
              <button class="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray/20 rounded-lg" @click="discard">
                Discard
              </button>
              <button
                class="px-10 py-2.5 mt-8 border text-[16px] text-white rounded-lg"
                :class="!isFilled ? 'bg-primary hover:bg-primary/80' : 'bg-secondary hover:bg-secondary/80'"
                :disabled="!isFilled"
                @click="createPost"
              >
                Post
              </button>
            </div>

            <div v-if="error" class="mt-4">
              <div class="text-red-600">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </section>
</template>
