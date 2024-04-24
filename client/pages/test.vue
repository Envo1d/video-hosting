<script setup lang="ts">
useSeoMeta({
	title: 'Test Page',
	ogTitle: 'Test Page',
})
</script>

<template>
	<NuxtLayout>
		<div
			class="pt-[80px] w-full grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-1"
		>
			<p class="text-white">TEST</p>
			<NuxtLink to="/" class="text-white">Home</NuxtLink>
		</div>
	</NuxtLayout>
</template>
