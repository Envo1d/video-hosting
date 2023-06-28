<script setup>
const { $generalStore, $userStore } = useNuxtApp()
const route = useRoute()
const router = useRouter()
</script>

<template>
  <div
    id="SideNavMain" :class="route.fullPath === '/' ? 'lg:w-[310px]' : 'lg:w-[220px]'"
    class="fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto"
  >
    <div class="lg:w-full w-[55px] mx-auto">
      <NuxtLink to="/">
        <MenuItem icon-string="For You" :color-string="route.path === '/' ? '#f02c56' : '#000000'" size-string="30" />
      </NuxtLink>
      <NuxtLink to="/following">
        <MenuItem icon-string="Following" :color-string="route.path === '/following' ? '#f02c56' : '#000000'" size-string="27" />
      </NuxtLink>
      <MenuItem icon-string="LIVE" color-string="#000000" size-string="27" />

      <div class="border-b lg:ml-2 mt-2" />

      <div v-if="$userStore.id">
        <div class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
          Suggested accounts
        </div>

        <div class="lg:hidden block pt-3" />

        <div
          v-for="sug in $generalStore.suggested"
        >
          <div class="cursor-pointer" @click="() => router.push(`/profile/${sug.id}`)">
            <MenuItemFollow :user="sug" />
          </div>
        </div>

        <button class="lg:block hidden text-[#f02c56] pt-1.5 pl-2 text-[13px]">
          See all
        </button>

        <div class="border-b lg:ml-2 mt-2" />

        <div class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
          Following accounts
        </div>

        <div class="lg:hidden block pt-3" />

        <div
          v-for="fol in $generalStore.following"
        >
          <div class="cursor-pointer" @click="() => router.push(`/profile/${fol.id}`)">
            <MenuItemFollow :user="fol" />
          </div>
        </div>

        <button class="lg:block hidden text-[#f02c56] pt-1.5 pl-2 text-[13px]">
          See more
        </button>
      </div>

      <div v-else>
        <div class="lg:block hidden text-lg text-gray-600 font-semibold pt-4 pb-2 px-2">
          Login to see suggested and following accounts
        </div>
      </div>

      <div class="lg:block hidden border-b lg:ml-2 mt-2" />

      <div class="lg:block hidden text-[11px] text-gray-500">
        <div class="pt-4 px-2">
          About Newsroom TikTok Shop Contact Careers ByteDance
        </div>
        <div class="pt-4 px-2">
          TikTok for Good Advertise Developers Transparency TikTok Rewards TikTok Browse TikTok Embeds
        </div>
        <div class="pt-4 px-2">
          Help Safety Terms Privacy Creator Portal Community Guidelines
        </div>
        <div class="pt-4 px-2">
          © 2023 TikTok
        </div>
      </div>

      <div class="pb-14" />
    </div>
  </div>
</template>
