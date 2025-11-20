<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	import { formatRuntime, historyStorage, isReleased } from '$lib';
	import { MediaCard } from '$lib/components/ui';

	let { data } = $props();

	const searchResults = $derived.by(() => {
		if (!data?.search?.edges) return [];

		const validEdges = data.search.edges.filter((edge) => edge.node.entity?.primaryImage?.url);

		return validEdges.map((searchResult) => {
			const entity = searchResult.node.entity;
			const titleType = entity.titleType.id;

			const [lastWatchedSeason, lastWatchedEpisode] = historyStorage.lastWatched(entity.id);
			const totalSeasons = entity.episodes?.displayableSeasons?.total;

			let href = `/${titleType === 'movie' || titleType === 'tvMovie' ? 'movie' : 'series'}/${entity.id}`;
			if (titleType === 'tvSeries') {
				href += `/?season=${lastWatchedSeason}&episode=${lastWatchedEpisode}`;
			}

			const genres = entity.titleGenres?.genres
				.map((g) => g.genre.text)
				.slice(0, 3)
				.join(' • ');

			const labels = [
				totalSeasons ? `${totalSeasons} season${totalSeasons > 1 ? 's' : ''}` : formatRuntime(entity?.runtime?.seconds || 0),
				isReleased(entity.releaseDate || {}) ? '' : 'upcoming',
			];

			return {
				id: entity.id,
				href: href,
				title: entity.titleText.text,
				posterUrl: entity.primaryImage?.url,
				genres: genres,
				rating: entity.ratingsSummary?.aggregateRating ?? 'N/A',
				labels: labels,
			};
		});
	});
</script>

<svelte:head>
	<title>BossFlix • Home</title>
</svelte:head>

<div class="flex min-h-full flex-col items-center justify-center py-8">
	<ul class="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2lg:grid-cols-[repeat(4,20rem)]">
		{#each searchResults as result (result.id)}
			<li
				in:fly={{ y: 18, opacity: 0, duration: 220, easing: quintIn }}
				out:fly={{ y: -8, opacity: 0, duration: 160, easing: quintOut }}
				class="w-fit text-center wrap-break-word transition-transform hover:scale-105"
				style="content-visibility: auto;"
			>
				<a href={result.href}>
					<MediaCard
						posterUrl={result.posterUrl}
						title={result.title}
						genres={result.genres}
						rating={result.rating}
						labels={result.labels}
					/>
				</a>
			</li>
		{/each}
	</ul>
</div>
