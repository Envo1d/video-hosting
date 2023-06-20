<script setup>
const layout = 'upload'
const file = ref(null)
const fileDisplay = ref(null)
const errorType = ref(null)
const caption = ref('')
const fileData = ref(null)
const errors = ref(null)
const isUploading = ref(false)

watch(() => caption.value, (caption) => {
  if (caption.length >= 150) {
    errorType.value = 'caption'
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

function onChange() {
  fileDisplay.value = URL.createObjectURL(file.value.files[0])
  fileData.value = file.value.files[0]
}

function discard() {
  file.value = null
  fileDisplay.value = null
  fileData.value = null
  caption.value = ''
}

function clearVideo() {
  file.value = null
  fileDisplay.value = null
  fileData.value = null
}
</script>

<template>
  <section>
    <UploadError :error-type="errorType" />

    <NuxtLayout :name="layout">
      <div class="w-full mt-[80px] mb-[40px] bg-white shadow-lg rounded-md py-6 md:px-10 px-4">
        <div>
          <div class="text-[23px] font-semibold">
            Upload video
          </div>
          <div class="text-gray-400 mt-1">
            Post a video to your account
          </div>
        </div>

        <div class="mt-8 gap-6 md:flex">
          <label
            v-if="!fileDisplay"
            for="fileInput"
            class="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[260px] h-[470px] text-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
            @drop.prevent="onDrop"
            @dragover.prevent
          >
            <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1" />
            <div class="mt-4 text-[17px]">Select video to upload</div>
            <div class="mt-1.5 text-gray-500 text-[13px]">Or drag and drop a file</div>
            <div class="mt-12 text-gray-400 text-sm">MP4</div>
            <div class="mt-2 text-gray-400 text-[13px]">Up to 30 minutes</div>
            <div class="mt-2 text-gray-400 text-[13px]">Less than 2 GB</div>
            <div class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#f02c56] rounded-sm">
              Select file
            </div>
            <input id="fileInput" ref="file" type="file" hidden accept=".mp4" @input="onChange">
          </label>

          <div
            v-else
            class="md:mx-0 mx-auto mt-4 md:mb-12 mb-16 flex items-center justify-center w-full max-w-[260px] h-[540px] p-3 rounded-2xl cursor-pointer relative"
          >
            <div class="bg-black h-full w-full" />

            <img src="~/assets/images/mobile-case.png" class="absolute z-20 pointer-events-none">

            <img src="~/assets/images/tiktok-logo-white.png" width="90" class="absolute right-4 bottom-6 z-20">

            <video :src="fileDisplay" autoplay loop muted class="absolute rounded-xl object-cover z-10 p-[13px] w-full h-full" />

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

          <div class="mt-4 mb-6">
            <div class="flex bg-[#f8f8f8] py-4 px-6">
              <div>
                <Icon class="mr-4" size="20" name="mdi:box-cutter-off" />
              </div>
              <div>
                <div class="text-semibold text-[15px] mb-1.5">
                  Divide videos and edit
                </div>
                <div class="text-semibold text-[13px] text-gray-400">
                  You can quickly divide videos into multiple parts, remove redundant parts and turn landscape videos into portrait videos
                </div>
              </div>
              <div class="flex justify-end max-w-[130px] w-full h-full text-center my-auto">
                <button class="px-8 py-1.5 text-white text-[15px] bg-[#f02c56] rounded-sm">
                  Edit
                </button>
              </div>
            </div>

            <div class="mt-5">
              <div class="flex items-center justify-between">
                <div class="mb-1 text-[15px]">
                  Caption
                </div>
                <div class="text-gray-400 text-[12px]">
                  {{ caption.length }}/150
                </div>
              </div>
              <input v-model="caption" type="text" maxlength="150" class="w-full border p-2.5 rounded-md focus:outline-none">
            </div>

            <div class="flex gap-3">
              <button class="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray-100 rounded-sm" @click="discard">
                Discard
              </button>
              <button class="px-10 py-2.5 mt-8 border text-[16px] text-white bg-[#f02c56] rounded-sm">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </section>
</template>