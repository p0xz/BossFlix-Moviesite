<script lang="ts">
	import type { PageProps } from './$types';
	import { watchedStore } from '$lib';
	import { getTitles } from './data.remote';

	// let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>BossFlix • History</title>
</svelte:head>

<div class="items grid grid-cols-4 justify-items-center">
	{#await getTitles([...watchedStore.state.keys()])}
		<p class="col-span-full">Loading history...</p>
	{:then data}
		{#each watchedStore.state.entries() as [k, v], index}
			{@const history = data.history[index]}
			<div class="flex flex-col">
				<div class="text-center">
					<img
						src={history.primaryImage.url}
						alt={history.originalTitleText.text}
						class="my-2 h-112 w-xs rounded-lg object-cover"
					/>
					<!-- <h3 class="mt-1 text-center">{history.originalTitleText.text}</h3>
					<p class="text-sm text-[#C9D3EE]">
						<span class:hidden={!history.releaseDate.year}> ({history.releaseDate.year})</span>
					</p> -->
				</div>
				<ul class="">
					{#each Array.from(v.entries()) as [season, episodes]}
						<li>
							Season {season}: Episodes {Array.from(episodes)
								.sort((a, b) => a - b)
								.join(', ')}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
		{#each watchedStore.state.entries() as [k, v], index}
			{@const history = data.history[index]}
			<div class="flex flex-col">
				<div class="text-center">
					<img
						src={history.primaryImage.url}
						alt={history.originalTitleText.text}
						class="my-2 h-112 w-xs rounded-lg object-cover"
					/>
					<!-- <h3 class="mt-1 text-center">{history.originalTitleText.text}</h3>
					<p class="text-sm text-[#C9D3EE]">
						<span class:hidden={!history.releaseDate.year}> ({history.releaseDate.year})</span>
					</p> -->
				</div>
				<ul class="">
					{#each Array.from(v.entries()) as [season, episodes]}
						<li>
							Season {season}: Episodes {Array.from(episodes)
								.sort((a, b) => a - b)
								.join(', ')}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	{/await}
</div>
