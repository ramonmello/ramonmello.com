<script lang="ts">
	import '../styles/tailwind.css';
	import { page } from '$app/stores';
	import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';
	import { browser } from '$app/environment';
	import I18NHeader from '$lib/I18NHeader.svelte';

	//Use the default language if no language is given
	$: lang = ($page.params.lang as AvailableLanguageTag) ?? sourceLanguageTag;
	$: setLanguageTag(lang);

	//Set the lang attribute on the html tag
	$: if (browser) document.documentElement.lang = lang;
</script>

<I18NHeader />

{#key lang}
	<slot />
{/key}
