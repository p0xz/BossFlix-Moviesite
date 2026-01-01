<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import EpisodeRating from '$lib/core/ui/EpisodeRating.svelte';
	import PlayerContainer from '$lib/features/player/components/PlayerContainer.svelte';
	import ServerSelector from '$lib/features/player/components/ServerSelector.svelte';
	import Rating from '$lib/core/ui/Rating.svelte';
	import { getResizedImage } from '$lib/features/media/logic/image';
	import { isReleased } from '$lib/features/media/utils/release';
	import { Icon } from '$lib/icons';
	import { fly } from 'svelte/transition';
	import { buildSourceUrl } from '$lib/features/player/logic/sources/registry';
	import { historyStorage } from '$lib/features/history/stores/history.store.svelte';
	import type { SourceOrigin } from '$lib/features/player/config/source.config';
	import { onMount } from 'svelte';

	let { data, params } = $props();

	let seasonSeed = $derived(Number(page.url.searchParams.get('season')) || 1);
	let episodeSeed = $derived(Number(page.url.searchParams.get('episode')) || 1);
	let iframeSrc = $derived(
		buildSourceUrl('vidsrc', params.id, {
			season: seasonSeed,
			episode: episodeSeed,
		}),
	);

	let videoSrc = $state<string>('');
	let selectedServer = $state<SourceOrigin | 'native'>('native');
	let autoPlay = $state(true);

	const seasonEpisodes = $derived(data.series.seasons.get(seasonSeed) ?? []);
	const hasMultipleSeasons = $derived(data.series.metadata.seasonsCount > 1);
	const currentNode = $derived(seasonEpisodes?.[episodeSeed - 1]?.node);
	const mediaGenres = $derived(data.series.metadata.genres.slice(0, 2));

	let isSeasonMenuActive = $state<boolean>(false);

	async function updateURL(season: number, episode: number) {
		return goto(`/series/${params.id}?season=${season}&episode=${episode}`, {
			replaceState: true,
			noScroll: true,
		});
	}

	function updateSeason(season: number) {
		if (seasonSeed === season) {
			isSeasonMenuActive = false;
			return;
		}

		isSeasonMenuActive = false;
		updateURL(season, 1);
	}

	function updateEpisode(episode: number) {
		if (episodeSeed === episode) return;
		updateURL(seasonSeed, episode);
		historyStorage.markEpisodes(params.id, seasonSeed, episode);
	}

	function handleNextEpisode() {
		// Find current episode in season list
		const currentIndex = seasonEpisodes.findIndex((e) => e.node.series?.episodeNumber.episodeNumber === episodeSeed);

		if (currentIndex !== -1 && currentIndex < seasonEpisodes.length - 1) {
			// Check next episode in same season
			const nextEp = seasonEpisodes[currentIndex + 1];
			if (nextEp && isReleased(nextEp.node.releaseDate ?? {})) {
				updateEpisode(nextEp.node.series?.episodeNumber.episodeNumber ?? episodeSeed + 1);
				return;
			}
		} else if (hasMultipleSeasons && seasonSeed < data.series.metadata.seasonsCount) {
			updateSeason(seasonSeed + 1);
		}
	}

	$effect(() => {
		historyStorage.markEpisodes(params.id, seasonSeed, episodeSeed);
	});

	$effect(() => {
		if (!iframeSrc) return;

		videoSrc = '';

		fetch(`/api/player/resolver?url=${encodeURIComponent(iframeSrc)}`)
			.then((res) => res.json())
			.then((response) => {
				videoSrc = `http://localhost:5173/api/proxy?url=${encodeURIComponent(response.videoUrl)}`;
			})
			.catch((e) => {
				console.error('Failed to load native player source', e);
			});
	});

	onMount(() => {
		historyStorage.init(params.id, {
			title: data.series.metadata.title,
			posterUrl: data.series.metadata.image ?? '',
			titleType: 'tvSeries',
			releaseYear: data.series.metadata.releaseDate?.year ?? 0,
			rating: Number(data.series.metadata.rating) || 0,
			genres: data.series.metadata.genres ?? [],
			runtime: 0,
			totalSeasons: data.series.metadata.seasonsCount ?? 0,
			totalEpisodes: data.series.metadata.episodesCount ?? 0,
		});
	});
</script>

<svelte:head>
	<title>BossFlix • {data.series.metadata.title}</title>
</svelte:head>

<div class="container mx-auto my-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem]">
	<article>
		<div class="mb-2 flex items-end justify-between gap-4">
			<h1 class="text-3xl font-black md:text-4xl">{data.series.metadata.title}</h1>
			<ServerSelector bind:selectedServer />
		</div>
		<p class="ml-px text-brand-primary-100">
			<span class="rounded bg-brand-primary-100/10 px-1.5 font-bold text-brand-primary-100">
				S{seasonSeed}:E{episodeSeed}
			</span>
			-
			<span>
				{currentNode?.titleText?.text}
			</span>
		</p>
	</article>
	<div class="col-start-1">
		<PlayerContainer
			url={videoSrc}
			mediaTitle={data.series.metadata.title}
			imdbId={params.id}
			season={seasonSeed}
			episode={episodeSeed}
			bind:selectedServer
			bind:autoPlay
			onEnded={handleNextEpisode}
			class="mx-auto mb-6 aspect-video w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
		/>

		<section>
			<div class="grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-surface p-6 text-sm md:grid-cols-4">
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Rating</span>
					<Rating rating={data.series.metadata.rating} class="text-lg" />
				</div>
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Year</span>
					<span class="text-lg font-bold text-white">
						<!-- TODO: Replace Airing by Unknown too if releaseDate is unknown -->
						{data.series.metadata.releaseDate?.year ?? 'Unknown'} - {data.series.metadata.releaseDate?.endYear ??
							'Airing'}
					</span>
				</div>
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Type</span>
					<span class="text-lg font-bold text-white capitalize"> series </span>
				</div>
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Genre</span>
					<p class="inline-flex items-center text-lg font-bold text-white">
						{#each mediaGenres as genre (genre)}
							<span>{genre}</span>
							{#if genre !== mediaGenres.at(-1)}
								<span class="mx-1 opacity-85">•</span>
							{/if}
						{/each}
					</p>
				</div>
			</div>

			<div class="mt-6 flex flex-col gap-2">
				<span class="text-xs font-bold tracking-wider text-gray-500 uppercase">Directed By</span>
				<div class="flex flex-wrap gap-2">
					{#each data.series.metadata.directors as director (director)}
						<span
							class="cursor-default rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm text-gray-200 transition-colors select-none hover:bg-white/10 hover:text-white"
						>
							{director}
						</span>
					{/each}
				</div>
			</div>

			<EpisodeRating rating={currentNode?.ratingsSummary?.aggregateRating ?? 'N/A'} class="mt-8 mb-4" />

			<article class="">
				<h1 class="mb-4 text-2xl font-bold">{currentNode?.titleText?.text}</h1>
				<p class="ml-px text-lg leading-relaxed text-gray-400">
					{currentNode?.plots?.edges?.[0]?.node?.plotText?.plainText ?? 'No plot available, yet.'}
				</p>
			</article>
		</section>
	</div>
	<div class="flex h-max max-h-[85vh] flex-col rounded-2xl border border-white/5 bg-surface/50 p-6 backdrop-blur-sm">
		<div class="mb-4 flex items-end justify-between">
			<h3 class="text-xl font-bold text-white">Episodes</h3>
			{#if hasMultipleSeasons}
				<span class="font-mono text-xs text-gray-500">
					{data.series.metadata.seasonsCount} Season{data.series.metadata.seasonsCount === 1 ? '' : 's'}
				</span>
			{/if}
		</div>

		{#if hasMultipleSeasons}
			<div class="relative z-10 mb-6">
				<button
					class="flex min-w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border border-white/10 bg-surface px-5 py-3 font-bold text-white transition-all hover:bg-white/5 md:w-64"
					onclick={() => (isSeasonMenuActive = !isSeasonMenuActive)}
				>
					<span class="text-lg">Season {seasonSeed}</span>
					<Icon.Linear.ChevronDown
						class="size-5 fill-current transition-transform duration-300 {isSeasonMenuActive ? 'rotate-180' : ''}"
					/>
				</button>

				{#if isSeasonMenuActive}
					<div
						class="overflow-bar absolute top-full left-0 mt-2 max-h-80 min-w-full overflow-y-auto rounded-xl border border-white/10 bg-[#1a1d2d] shadow-2xl md:w-64"
						transition:fly={{ y: -10, duration: 300 }}
					>
						{#each { length: data.series.metadata.seasonsCount as number } as _, index}
							<button
								class={[
									'flex w-full cursor-pointer items-center justify-between bg-white/5 px-4 py-3 text-left text-sm transition-colors hover:bg-white/10',
									seasonSeed === index + 1 ? 'font-bold text-brand-primary-100' : 'text-gray-300',
								]}
								onclick={() => updateSeason(index + 1)}
							>
								<span>Season {index + 1}</span>
								<span class="bg-brand h-2 w-2 rounded-full"></span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<div class="overflow-bar flex-1 space-y-2 overflow-y-auto pr-2">
			{#each seasonEpisodes as episode (episode.node.id)}
				{@const isEpisodeActive = episodeSeed === episode.node.series?.episodeNumber.episodeNumber}
				{@const isEpisodeReleased = isReleased(episode.node?.releaseDate ?? {})}
				{@const isEpisodeWatched = historyStorage.isEpisodeWatched(
					params.id,
					seasonSeed,
					episode.node.series?.episodeNumber.episodeNumber ?? 0,
				)}
				<button
					class={[
						'group flex items-center gap-4 rounded-xl p-3 ring-0 transition-all',
						!isEpisodeReleased
							? 'cursor-not-allowed opacity-60 grayscale'
							: isEpisodeActive
								? 'cursor-pointer border border-brand-primary-100/50 bg-[#1c1f2e]'
								: 'cursor-pointer border border-transparent hover:border-white/10 hover:bg-white/5',
					]}
					disabled={!isEpisodeReleased}
					style="content-visibility: auto; contain-intrinsic-size: auto 200px;"
					onclick={() => updateEpisode(episode.node.series?.episodeNumber.episodeNumber || 1)}
				>
					<div class="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
						<img
							src={getResizedImage(episode.node.primaryImage?.url, 320, 95)}
							class={[
								'h-full w-full object-cover transition-opacity',
								!isEpisodeReleased
									? 'opacity-40'
									: isEpisodeActive
										? 'opacity-100'
										: 'opacity-70 group-hover:opacity-100',
							]}
							alt={episode.node.titleText?.text}
						/>
						<div
							class={[
								'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100',
								(isEpisodeActive || !isEpisodeReleased) && 'hidden',
							]}
						>
							<Icon.Filled.Play class="size-8 fill-white drop-shadow-lg" />
						</div>

						<div class={['absolute inset-0 flex flex-col items-center justify-center', isEpisodeReleased && 'hidden']}>
							<Icon.Filled.Lock class="size-8 fill-white drop-shadow-lg" />
							<span class="text-[0.625rem]">
								{#if episode.node.releaseDate == null}
									Coming Soon
								{:else if episode.node.releaseDate?.year && !episode.node.releaseDate?.month && !episode.node.releaseDate?.day}
									{episode.node.releaseDate?.year}
								{:else}
									{episode.node.releaseDate?.day}.{episode.node.releaseDate?.month}.{episode.node.releaseDate?.year}
								{/if}
							</span>
						</div>
					</div>
					<div class="text-left">
						<div class="mb-0.5 flex items-center gap-2">
							<span class="rounded bg-brand-primary-100/10 px-1.5 text-[0.625rem] font-bold text-brand-primary-100">
								EP {episode.node.series?.episodeNumber.episodeNumber}
							</span>
							<span
								class={[
									'animate-pulse text-[0.5rem] font-bold tracking-wider text-brand-primary-100 uppercase',
									(!isEpisodeActive || !isEpisodeReleased) && 'hidden',
								]}
							>
								Now Playing
							</span>
							<span class="ml-auto" role="button" aria-label="Mark as watched">
								<Icon.Filled.Eye
									class={[
										'size-4 transition-colors',
										isEpisodeWatched
											? 'fill-brand-primary-100'
											: isEpisodeActive || !isEpisodeReleased
												? 'fill-gray-400'
												: 'fill-gray-500 group-hover:fill-gray-400',
									]}
								/>
							</span>
						</div>
						<div class="group-hover:text-brand text-sm font-bold text-white transition-colors">
							{episode.node.titleText?.text}
						</div>
						<div
							class={[
								'mt-1 line-clamp-1 text-xs group-hover:text-gray-400',
								isEpisodeActive || !isEpisodeReleased ? 'text-gray-400' : 'text-gray-500',
							]}
						>
							{episode.node.plots?.edges[0]?.node.plotText.plainText ?? 'No plot available, yet.'}
						</div>
					</div>
				</button>
			{:else}
				<p class="text-sm text-gray-500">No episodes available.</p>
			{/each}
		</div>
	</div>
</div>
