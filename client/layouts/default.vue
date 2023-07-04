<script setup>
const route = useRoute()
</script>

<template>
  <section>
    <TopNav />
    <div
      class="flex mx-auto w-full lg:px-2.5 px-0"
    >
      <div v-if="!route.path.includes('/post')" class="flex flex-row">
        <SideNavMain />
        <div class="ml-[calc(134px+120px)]">
          <slot />
        </div>
      </div>
      <div v-else>
        <div class="mt-[82px]">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
