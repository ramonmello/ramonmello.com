<div class="pancake-stack">
	<header></header>
	<main>
		<slot />
	</main>
	<footer></footer>
</div>

<style>
	.pancake-stack {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100dvh;
	}
</style>
