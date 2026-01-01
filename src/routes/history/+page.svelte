<script lang="ts">
	import { historyStorage } from '$lib/features/history/stores/history.store.svelte';
	import { formatRuntime } from '$lib/core/utils/date';
	import MediaCard from '$lib/features/media/components/MediaCard.svelte';

	// Get all history entries as a clean array
	const historyEntries = $derived(
		historyStorage.getAll().map(([id, data]) => {
			const isSeries = data.seasons !== null;
			const progress = isSeries ? historyStorage.getProgress(id) : null;
			const [lastSeason, lastEpisode] = isSeries ? historyStorage.lastWatched(id) : [0, 0];
			const isWatched = isSeries ? progress?.watched === progress?.total : true;

			return {
				id,
				isSeries,
				title: data.entries.title,
				posterUrl: data.entries.posterUrl,
				genres: data.entries.genres.slice(0, 3).join(' • '),
				rating: data.entries.rating,
				runtime: data.entries.runtime,
				totalSeasons: data.entries.totalSeasons,
				progress,
				lastSeason,
				lastEpisode,
				isWatched,
			};
		}),
	);

	function getMediaUrl(entry: (typeof historyEntries)[number]): string {
		const baseUrl = `/${entry.isSeries ? 'series' : 'movie'}/${entry.id}`;
		if (entry.isSeries) {
			return `${baseUrl}?season=${entry.lastSeason}&episode=${entry.lastEpisode}`;
		}
		return baseUrl;
	}

	function getLabels(entry: (typeof historyEntries)[number]): (string | number)[] {
		if (entry.isSeries && entry.progress) {
			const { watched, total, percentage } = entry.progress;
			const isCompleted = watched === total;
			const seasonsText = `${entry.totalSeasons} season${entry.totalSeasons! > 1 ? 's' : ''}`;

			return [`${watched} of ${total} watched`, isCompleted ? 'completed' : `watching`, seasonsText];
		}
		return ['watched', formatRuntime(entry.runtime || 0)];
	}

	function clearHistory() {
		if (window.confirm('Are you sure you want to clear your entire watch history?')) {
			historyStorage.reset();
		}
	}
</script>

<svelte:head>
	<title>BossFlix • History</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if historyEntries.length > 0}
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Watch History</h1>
				<p class="mt-1 text-sm text-gray-400">
					{historyEntries.length} item{historyEntries.length > 1 ? 's' : ''}
				</p>
			</div>

			<button
				onclick={clearHistory}
				class="cursor-pointer rounded-lg border border-brand-red-200 px-4 py-2 text-sm font-medium text-brand-red-200 transition-colors hover:bg-brand-red-200/10"
			>
				Clear History
			</button>
		</div>

		<ul class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6">
			{#each historyEntries as entry (entry.id)}
				<li class="max-w-96 transition-transform hover:scale-105">
					<a href={getMediaUrl(entry)}>
						<MediaCard
							class="w-full"
							posterUrl={entry.posterUrl}
							title={entry.title}
							genres={entry.genres}
							rating={entry.rating}
							labels={getLabels(entry)}
						/>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
			<svg class="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<h2 class="text-2xl font-bold text-gray-300">No Watch History Yet</h2>
			<p class="max-w-md text-gray-400">
				Start watching movies and series to build your personal history. We'll keep track of everything for you!
			</p>
			<a
				href="/discover"
				class="mt-4 rounded-lg bg-brand-primary-100 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-primary-100/90"
			>
				Discover Movies
			</a>
		</div>
	{/if}
</div>
