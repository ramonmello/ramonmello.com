<div class="parent">
	<header>Header</header>
	<main>
		<slot />
	</main>
	<footer>Footer Content</footer>
</div>

<style lang="postcss">
	.parent {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}
</style>
