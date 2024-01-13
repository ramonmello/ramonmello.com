<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<main class="flex h-screen w-screen flex-col font-sans">
	<section class="flex flex-1 flex-col items-center justify-center">
		<div class="flex flex-col">
			<p class="mb-4 ml-2 text-sm uppercase text-gray md:mb-8 md:text-lg">{m.i_am()}</p>
			<h1 class="text-8xl font-bold md:text-9xl">Ramon</h1>
			<div class="-mt-4 inline-flex w-full justify-between">
				<img
					src="./images/avatar.jpeg"
					alt=""
					class="mt-2 h-16 w-16 rounded-full md:mt-0 md:h-24 md:w-24"
				/>
				<h1 class="text-8xl font-bold md:text-9xl">Mello</h1>
			</div>
			<p class="mr-2 mt-1 self-end text-right text-sm uppercase text-gray md:mt-3 md:text-lg">
				{@html m.a_software_developer()}
			</p>
		</div>
	</section>
</main>

<style lang="postcss">
	p :global(span) {
		@apply bg-gradient-to-r from-yellow to-orange bg-clip-text text-transparent;
	}
</style>
