<script lang="ts">
	import Switch from '$lib/components/SwitchLang.svelte';
	import * as m from '$paraglide/messages';
</script>

<Switch />
<h1>{m.hello_world()}</h1>
