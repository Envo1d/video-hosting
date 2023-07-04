<script setup>
const { $generalStore, $userStore } = useNuxtApp()
const route = useRoute()
const router = useRouter()
</script>

<template>
  <div
    id="SideNavMain"
    class="fixed z-20 lg:w-[134px] bg-main pt-[70px] h-full w-[75px] overflow-auto"
  >
    <div class="lg:w-full w-[55px] mx-auto">
      <NuxtLink to="/">
        <MenuItem icon-name="basil:home-outline" icon-string="Home" :color-string="route.path === '/' ? 'secondary' : 'gray'" size-string="22" />
      </NuxtLink>
      <NuxtLink to="/subscriptions">
        <MenuItem icon-string="Subscriptions" icon-name="eos-icons:product-subscriptions-outlined" :color-string="route.path === '/subscriptions' ? 'secondary' : 'gray'" size-string="22" />
      </NuxtLink>

      <div v-if="$userStore.id">
        <div class="lg:block hidden text-[18px] text-white font-bold mt-[58px]">
          Subscriptions
        </div>

        <div class="my-[15px]" />

        <div
          v-for="fol in $generalStore.following"
          :key="fol.id"
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
        <div class="lg:block hidden text-lg text-gray font-semibold pt-4 pb-2 px-2 mt-5">
          Login to see suggested and following accounts
        </div>
      </div>
    </div>
  </div>
</template>
