<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<main class="flex h-screen w-screen flex-col font-sans">
	<section class="flex flex-1 flex-col items-center justify-center">
		<div class="flex flex-col">
			<p class="mb-8 ml-2 text-lg uppercase text-gray">{m.i_am()}</p>
			<h1 class="text-9xl font-bold">Ramon</h1>
			<div class="-mt-4 inline-flex w-full justify-between">
				<img src="./images/avatar.jpeg" alt="" class="h-24 w-24 rounded-full" />
				<h1 class="text-9xl font-bold">Mello</h1>
			</div>
			<p class="mr-2 mt-3 self-end text-right text-lg uppercase text-gray">
				{@html m.a_software_developer()}
			</p>
		</div>
	</section>
</main>

<!-- <style lang="postcss"> -->
<!-- 	p :global(span) { -->
<!-- 		background: var(--Gradient, linear-gradient(270deg, #f8461d 35.42%, #f2b32d 100%)); -->
<!-- 		background-clip: text; -->
<!-- 		-webkit-text-fill-color: transparent; -->
<!-- 	} -->
<!-- </style> -->

<style lang="postcss">
	p :global(span) {
		@apply bg-gradient-to-r from-yellow to-orange bg-clip-text text-transparent;
	}
</style>
