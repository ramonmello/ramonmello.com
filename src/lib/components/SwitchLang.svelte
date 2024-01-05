<script lang="ts">
	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { route } from '$lib/i18n-routing';
</script>

{#each availableLanguageTags as lang}
	<a href={route($page.url.pathname, lang)} hreflang={lang}>Change language to {lang}</a>
{/each}
