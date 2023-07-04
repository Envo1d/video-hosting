<script setup lang='ts'>
import { storeToRefs } from 'pinia'

defineProps({
  videoUrl: {
    type: String,
  },
})

const { $generalStore } = useNuxtApp()
const { selectedPost } = storeToRefs($generalStore)

const video = ref<HTMLVideoElement>()
const container = ref<HTMLDivElement>()
const timeline = ref<HTMLDivElement>()
const isPlaying = ref(false)
const isEnded = ref(false)
const progressBarPercent = ref('')
const volumeIconState = ref(3)
const volume = ref<HTMLInputElement>()
const isShowSpeed = ref(false)
const speed = ref(1.0)
const isFullscreen = ref(false)
const currentVideoTime = ref('00:00')
const videoDuration = ref('00:00')
const progressTime = ref<HTMLSpanElement>()
const isShowControls = ref(false)
let timer: NodeJS.Timeout

enum EnumVolumeIconState {
  'ion:volume-mute' = 0,
  'ion:volume-low' = 1,
  'ion:volume-medium' = 2,
  'ion:volume-high' = 3,
}

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  $generalStore.selectedPost = null

  try {
    await $generalStore.getPostById(route.params.id as string)

    useSeoMeta({
      title: `${selectedPost.value?.title}`,
      ogTitle: `${selectedPost.value?.title}`,
    })
  }
  catch (error: any) {
    if (error && error.response.status === 400)
      router.push('/')
  }
})

onBeforeUnmount(() => {
  video.value?.pause()
})

watch(() => $generalStore.selectedPost, () => {})
watch(() => video.value, () => {
  if (video.value) {
    video.value.addEventListener('timeupdate', e => updateProgressBar(e), false)
    videoDuration.value = $generalStore.convertTime(video.value.duration)
  }
})
watch(() => speed.value, () => {
  if (speed.value)
    onVideoSpeedChange()
})

function hideControls() {
  if (video.value?.paused)
    return
  timer = setTimeout(() => {
    isShowControls.value = false
  }, 1500)
}
hideControls()

function onContainerMouseMove() {
  isShowControls.value = true
  clearTimeout(timer)
  hideControls()
}

function onTimelineClick(e: MouseEvent) {
  const timelineWidth = (e.target as HTMLDivElement).clientWidth
  if (video.value)
    video.value.currentTime = (e.offsetX / timelineWidth) * video.value.duration
}

function draggableProgressBar(e: MouseEvent) {
  const timelineWidth = (e.target as HTMLDivElement).clientWidth
  if (video.value && progressBarPercent.value) {
    progressBarPercent.value = `${e.offsetX}px`
    video.value.currentTime = (e.offsetX / timelineWidth) * video.value.duration
  }
}

function onTimelineMousedown() {
  if (timeline.value)
    timeline.value.addEventListener('mousemove', draggableProgressBar, false)
}

function onTimelineMouseup() {
  if (timeline.value)
    timeline.value.removeEventListener('mousemove', draggableProgressBar, false)
}

function onTimelineMousemove(e: MouseEvent) {
  if (progressTime.value && timeline.value && video.value) {
    progressTime.value.style.left = `${e.offsetX}px`
    const timelineWidth = timeline.value.clientWidth
    const percent = (e.offsetX / timelineWidth) * video.value.duration
    progressTime.value.innerText = $generalStore.convertTime(percent)
  }
}

function updateProgressBar(e: Event) {
  const { currentTime, duration } = e.target as HTMLVideoElement
  progressBarPercent.value = `${(currentTime / duration) * 100}%`
  currentVideoTime.value = $generalStore.convertTime(currentTime)
}

function onVideoEnded() {
  isPlaying.value = false
  isEnded.value = true
  video.value?.removeEventListener('ended', onVideoEnded, false)
}

function onPlayPauseClick() {
  if (video.value?.paused) {
    video.value.play()
    isEnded.value = false
    video.value.addEventListener('ended', onVideoEnded, false)
  }
  else { video.value?.pause() }
  isPlaying.value = !isPlaying.value
}

function onSkipClick(type: 'forward' | 'backward') {
  if (video.value) {
    if (type === 'forward')
      video.value.currentTime += 5
    else video.value.currentTime -= 5
  }
}

function onVolumeClick() {
  if (video.value && volume.value) {
    if (volumeIconState.value === 0) {
      volumeIconState.value = 3
      video.value.volume = 1
      volume.value.value = '100'
    }
    else {
      volumeIconState.value = 0
      video.value.volume = 0
      volume.value.value = '0'
    }
  }
}

function onVolumeInputChange() {
  if (video.value && volume.value) {
    const value = Number.parseInt(volume.value.value)
    if (value >= 75)
      volumeIconState.value = 3
    else if (value >= 25)
      volumeIconState.value = 2
    else if (value > 0)
      volumeIconState.value = 1
    else volumeIconState.value = 0
    video.value.volume = value / 100
  }
}

function onVideoSpeedChange() {
  if (video.value && speed.value) {
    video.value.playbackRate = speed.value
    isShowSpeed.value = false
  }
}

function onFullscreenClick() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  }
  else {
    if (container.value) {
      container.value.requestFullscreen()
      isFullscreen.value = true
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement)
          isFullscreen.value = false
      })
    }
  }
}

function loadedData() {
  if (video.value?.readyState === 4) {
    videoDuration.value = $generalStore.convertTime(video.value?.duration)
    setTimeout(() => {
      onPlayPauseClick()
    }, 500)
  }
}
</script>

<template>
  <div v-if="videoUrl" ref="container" class="container" :class="{ 'show-controls': isShowControls }" @mouseup="onTimelineMouseup" @mousemove="onContainerMouseMove">
    <div class="wrapper">
      <div ref="timeline" class="video-timeline" @click="(e) => onTimelineClick(e)" @mousedown="onTimelineMousedown" @mousemove="onTimelineMousemove">
        <div class="progress-area">
          <span ref="progressTime">00:00</span>
          <div class="progress-bar" :style="{ width: `${progressBarPercent}` }" />
        </div>
      </div>
      <ul class="video-controls">
        <li class="options left">
          <button class="volume -mt-1" @click="onVolumeClick">
            <Icon :name="EnumVolumeIconState[volumeIconState]" />
          </button>
          <input ref="volume" value="100" type="range" @input="onVolumeInputChange">
          <div class="video-timer">
            <p class="current-time">
              {{ currentVideoTime }}
            </p>
            <p class="separator">
              /
            </p>
            <p class="video-duration">
              {{ videoDuration }}
            </p>
          </div>
        </li>
        <li class="options center">
          <button class="skip-backward">
            <Icon name="bi:skip-backward-fill" @click="onSkipClick('backward')" />
          </button>
          <button class="play-pause" @click="onPlayPauseClick">
            <Icon :name="isEnded ? 'material-symbols:replay-rounded' : isPlaying ? 'material-symbols:pause-rounded' : 'ion:play'" />
          </button>
          <button class="skip-forward" @click="onSkipClick('forward')">
            <Icon name="bi:skip-forward-fill" />
          </button>
        </li>
        <li class="options right">
          <div class="playback-content">
            <button class="playback-speed" @click="() => isShowSpeed = !isShowSpeed">
              <Icon name="material-symbols:slow-motion-video-rounded" />
            </button>
            <ul class="speed-options" :class="isShowSpeed ? 'show' : ''">
              <li :class="speed === 2 ? 'active' : ''" @click="speed = 2">
                2x
              </li>
              <li :class="speed === 1.5 ? 'active' : ''" @click="speed = 1.5">
                1.5x
              </li>
              <li :class="speed === 1 ? 'active' : ''" @click="speed = 1">
                1x
              </li>
              <li :class="speed === 0.75 ? 'active' : ''" @click="speed = 0.75">
                0.75x
              </li>
              <li :class="speed === 0.5 ? 'active' : ''" @click="speed = 0.5">
                0.5x
              </li>
            </ul>
          </div>
          <button class="pic-in-pic" @click="video?.requestPictureInPicture()">
            <Icon name="ic:round-picture-in-picture-alt" />
          </button>
          <button class="fullscreen" @click="onFullscreenClick">
            <Icon :name="isFullscreen ? 'material-symbols:fullscreen-exit-rounded' : 'material-symbols:fullscreen-rounded'" size="24" class="mt-0.5" />
          </button>
        </li>
      </ul>
    </div>
    <video ref="video" preload="auto" allowfullscreen type="video/mp4" :src="videoUrl" @loadeddata="() => loadedData()" @click="onPlayPauseClick" />
  </div>
</template>

<style scoped>
.container {
	width: 100%;
  max-height: 700px;
	background: #000;
	position: relative;
	border-radius: 5px;
	overflow: hidden;
	aspect-ratio: 16/9;
	display: flex;
	justify-content: center;
	align-items: center;
	object-fit: cover
}
.container video {
	width: 100%;
	height: 100%;
}
.container:fullscreen {
	width: 100%;
	max-width: 100%;
}
.wrapper {
	position: absolute;
	left: 0;
	right: 0;
	bottom: -15px;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  transition: all 0.2s ease-in-out;
}
.container.show-controls .wrapper {
  bottom: 0px;
  opacity: 1;
  pointer-events: auto;
}
.wrapper::before{
	content: '';
	bottom: 0;
	width: 100%;
	z-index: -1;
	position: absolute;
	background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
	height: calc(100% + 35px);
}
.video-timeline {
	height: 7px;
	width: 100%;
	cursor: pointer;
}
.video-timeline .progress-area {
	height: 3px;
	position: relative;
	background: rgba(255, 255, 255, 0.212);
}
.progress-area span {
	position: absolute;
	left: 50%;
	color: #fff;
	top: -25px;
	font-size: 13px;
	transform: translateX(-50%);
}
.progress-area .progress-bar {
	width: 0%;
	height: 100%;
	position: relative;
	background: #AD00FF;
}
.progress-area .progress-bar::before {
	content: '';
	position: absolute;
	right: 0;
	top: 50%;
	height: 13px;
	width: 13px;
	background: inherit;
	transform: translateY(-50%);
	border-radius: 50%;
}
.progress-area span, .progress-area .progress-bar::before {
	display: none;
}
.video-timeline:hover .progress-area span,
.video-timeline:hover .progress-area .progress-bar::before {
	display: block;
}
.video-controls, .video-timer, .options {
	display: flex;
	align-items: center;
	justify-content: center;
}
.video-controls {
	padding: 5px 20px 10px;
}
.video-controls, .options {
	width: 100%;
}
.video-controls, .options:first-child {
	justify-content: flex-start;
}
.video-controls, .options:last-child {
	justify-content: flex-end;
}
.options button {
	width: 40px;
	height: 40px;
	border: none;
	color: #fff;
	background: none;
	font-size: 19px;
	cursor: pointer;
  transition: color .25s ease-in-out;
}
.options button:hover {
  color:#AD00FF;
}
.options input {
	-webkit-appearance: none;
  max-width: 75px;
  height: 4px;
  border-radius: 5px;
  background: #fff;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}
.options input::-webkit-slider-thumb {
	-webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #AD00FF;
  filter: brightness(300%);
  cursor: pointer;
}
.options input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #AD00FF;
	filter: brightness(300%);
  cursor: pointer;
}
.options button :where(svg) {
	/* width: 50%;
	height: 50%;
	line-height: 40px; */
}
.options .video-timer {
	font-size: 14px;
	color: #fff;
	margin-left: 15px;
}
.video-timer .separator {
	font-size: 16px;
	margin: 0 5px;
}
.playback-content {
	position: relative;
}
.playback-content .speed-options {
	position: absolute;
	background: #fff;
	bottom: 40px;
	left: -40px;
	list-style: none;
	width: 95px;
	border-radius: 4px;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.13s ease;
}
.playback-content .speed-options.show {
	opacity: 1;
	pointer-events: auto;
}
.speed-options li {
	font-size: 14px;
	padding: 5px 0 5px 15px;
	cursor: pointer;
  color:#000
}
.speed-options li.active {
	background: #AD00FF;
	color: #fff;
}
.speed-options li:hover {
	background: #ae00ffb2;
	color: #fff;
}
</style>
