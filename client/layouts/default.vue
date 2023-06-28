<script setup>
const route = useRoute()
</script>

<template>
  <section>
    <TopNav />
    <div
      :class="route.fullPath === '/' || route.fullPath === '/following' ? 'max-w-[1140px]' : ''"
      class="flex justify-between mx-auto w-full lg:px-2.5 px-0"
    >
      <div>
        <SideNavMain />
      </div>

      <slot />
    </div>
  </section>
</template>
