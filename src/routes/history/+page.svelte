<script lang="ts">
	import { formatRuntime, watchedStore } from '$lib';
	import { MediaCard } from '$lib/components/ui';
	import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
</script>

<svelte:head>
	<title>BossFlix • History</title>
</svelte:head>

<div class="container mx-auto grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] place-items-center gap-8 py-8">
	{#each watchedStore.state.entries() as [id, v]}
		{@const totalEpisodes = v[0].totalEpisodes}
		{@const watchedEntries = v[0]}
		{@const titleType = watchedEntries.titleType.toLowerCase()}
		{@const isSeries = titleType.includes('series')}
		{@const watchedCount = isSeries
			? Array.from((v[1] as SvelteMap<number, SvelteSet<number>>).values()).reduce((acc, set) => acc + set.size, 0)
			: 0}
		{@const seasonsMap = v[1]}
		{@const lastWatched = watchedStore.lastWatched(id)}
		{@const totalSeasons = watchedEntries.totalSeasons}
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
	{/each}

	<!-- <button
		class="bg-beta absolute bottom-24 ml-1 cursor-pointer rounded px-2 py-0.5 font-Poppins font-medium"
		onclick={() => {
			watchedStore.reset();
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
