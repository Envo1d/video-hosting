<template>
  <div
    class="h-[100vh]"
  >
    <TopNav />
    <div class="flex justify-between mx-auto w-full px-2 max-w-[calc(100vw-30px)]">
      <slot />
    </div>
  </div>
</template>
