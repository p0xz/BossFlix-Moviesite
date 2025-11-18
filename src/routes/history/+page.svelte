<script lang="ts">
	import { formatRuntime, historyStorage } from '$lib';
	import { MediaCard } from '$lib/components/ui';
	import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
</script>

<svelte:head>
	<title>BossFlix • History</title>
</svelte:head>

<div class="container mx-auto grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] place-items-center gap-8 py-8">
	{#each historyStorage.state.entries() as [id, v]}
		{@const watchedEntries = v.entries}
		{@const seasonsMap = v.seasons}

		{@const isSeries = seasonsMap !== null}

		{@const totalEpisodes = watchedEntries.totalEpisodes}
		{@const totalSeasons = watchedEntries.totalSeasons}

		{@const watchedCount = isSeries ? Array.from(seasonsMap.values()).reduce((acc, set) => acc + set.size, 0) : 0}

		{@const lastWatched = historyStorage.lastWatched(id)}

		<a
			href={`/${isSeries ? 'series' : 'movie'}/${id}${isSeries ? `/?season=${lastWatched[0]}&episode=${lastWatched[1]}` : ''}`}
			class="transition-transform hover:scale-105"
		>
			<MediaCard
				posterUrl={watchedEntries.posterUrl}
				title={watchedEntries.title}
				genres={watchedEntries.genres.slice(0, 3).join(' • ')}
				labels={isSeries
					? [
							`${watchedCount} of ${totalEpisodes} watched`,
							watchedCount === totalEpisodes ? 'completed' : 'watching',
							`${totalSeasons} season${(totalSeasons as number) > 1 ? 's' : ''}`,
						]
					: ['watched', formatRuntime(watchedEntries.runtime as number)]}
				rating={watchedEntries.rating}
			/>
		</a>
	{:else}
		<h2 class="text-center col-span-full text-2xl font-Chewy">Hey, your history’s empty — you should fix that right now</h2>
	{/each}

	<!-- <button
		class="bg-beta absolute bottom-24 ml-1 cursor-pointer rounded px-2 py-0.5 font-Poppins font-medium"
		onclick={() => {
			historyStorage.reset();
			localStorage.setItem('bf-watched', '[]');
		}}
	>
		reset
	</button> -->
</div>

<style>
	.bg-beta {
		background: linear-gradient(353deg, #4449a9 17.51%, #7c87f7 183.08%);
		box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.25) inset;
	}
</style>
