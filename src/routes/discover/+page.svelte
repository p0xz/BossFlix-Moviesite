<script lang="ts">
	import type { PageProps } from './$types';
	import DiscoverSideBar from './DiscoverSideBar.svelte';
	import DiscoverGrid from './DiscoverGrid.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>BossFlix • Discover</title>
</svelte:head>

<div class="grid h-full grid-cols-[20rem_1fr]">
	<DiscoverSideBar />

	<DiscoverGrid data={data.advancedSearch} />
</div>
