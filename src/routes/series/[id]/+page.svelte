<!-- <script lang="ts">
	import type { PageProps } from './$types';
	import type { PlayerMessageEmitter } from '$lib/types';
	import type { sourceOrigins } from '$lib/utils/sources';
	import { isPlayerEvent, playerJsMessageEmitter } from '$lib/utils/videoPlayer';
	import { type Imdb } from '$lib/types';
	import { page } from '$app/state';
	import { onMount, untrack } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { goto, invalidate } from '$app/navigation';
	import { capitalize, fixDigits } from '$lib/utils/common';
	import { outsideClick } from '$lib/attachments';
	import { SourceBuilder } from '$lib/utils/sources';
	import { historyStorage } from '$lib/stores/historyStore.svelte';
	import { EpisodesMenu, Loader, MediaCard, DropdownMenu, OptionsDropdown } from '$lib/components/ui';
	import { Icon } from '$lib/icons';

	let { data, params }: PageProps = $props();

	const CHUNK = 30;
	const title = data?.series?.originalTitleText?.text ?? 'Untitled';
	const year = data.series?.releaseDate?.year;

	let seasonSeed = $derived(Number(page.url.searchParams.get('season')) || 1);
	let episodeSeed = $derived(Number(page.url.searchParams.get('episode')) || 1);

	const nodes = new SvelteMap<number, Imdb.Series['episodes']['seasonEpisodes']['edges']>();
	let defaultSource = $state<sourceOrigins>('vidsrc');
	let iframeRef = $state<HTMLIFrameElement>();

	let playerOptions = $state({
		autoPlay: true,
		autoNext: true,
		autoSubtitles: true,
	});

	let isSeasonMenuActive = $state(false);
	let isEpisodeMenuActive = $state(false);
	let isServersMenuActive = $state(false);
	let isPlayerSettingsMenuActive = $state(false);

	let isPlayerNavigating = $state(false);

	let iframeSrc = $state('');

	let episodeChunk = $derived(Math.max(0, Math.floor((episodeSeed - 1) / CHUNK)));
	const seasonEdges = $derived(nodes.get(seasonSeed) ?? []);
	const totalEpisodes = $derived(seasonEdges.length);
	const chunkCount = $derived(Math.ceil(totalEpisodes / CHUNK));

	const currentEpisodeNode = $derived.by(() => {
		return seasonEdges.find((edge) => {
			const epNumber = edge.node.series.episodeNumber.episodeNumber;
			return epNumber === episodeSeed;
		})?.node;
	});

	const episodePlot = $derived(currentEpisodeNode?.plots?.edges?.[0]?.node?.plotText?.plainText ?? 'No plot available, yet.');
	const seasons = $derived(data?.series?.episodes?.seasons ?? []);

	const episodesForUI = $derived.by<Imdb.Series['episodes']['seasonEpisodes']['edges']>(() => {
		const start = episodeChunk * CHUNK;
		const end = start + CHUNK;
		return seasonEdges.slice(start, end);
	});

	const episodeRanges = $derived.by(() =>
		Array.from({ length: chunkCount }, (_, idx) => {
			const start = fixDigits(idx * CHUNK + 1);
			const end = Math.min((idx + 1) * CHUNK, totalEpisodes);
			return `${start}-${end}`;
		}),
	);

	const currentRangeLabel = $derived(
		totalEpisodes ? `${fixDigits(episodeChunk * CHUNK + 1)}-${Math.min((episodeChunk + 1) * CHUNK, totalEpisodes)}` : '',
	);

	async function updateURL(season: number, episode: number) {
		return goto(`/series/${params.id}?season=${season}&episode=${episode}`, {
			replaceState: true,
			noScroll: true,
		});
	}

	function updateEpisode(episode: number) {
		if (episodeSeed === episode) return;
		updateURL(seasonSeed, episode);
	}

	async function updateSeason(season: number) {
		if (seasonSeed === season) {
			isSeasonMenuActive = false;
			return;
		}

		isSeasonMenuActive = false;
		await updateURL(season, 1);

		if (!nodes.has(season)) {
			invalidate('app:episodes');
		}
	}

	let messages = $state<any[]>([]);

	async function handleMessage(
		event: MessageEvent<any> & {
			currentTarget: EventTarget & Window;
		},
	) {
		const incomingMessage = <PlayerMessageEmitter.PlayerJS.PlayerEventData>event.data;

		const isEventSubtitle =
			!isPlayerEvent(incomingMessage) && (incomingMessage.event === 'subtitle' || incomingMessage.event === 'subtitles');
		const arePlayerSubtitlesOn = typeof incomingMessage.data === 'string' && incomingMessage.data !== 'off';

		if (isEventSubtitle && arePlayerSubtitlesOn && !playerOptions.autoSubtitles && defaultSource === 'vidsrc') {
			playerJsMessageEmitter(iframeRef?.contentWindow, 'subtitle', -1);
		}

		if (!isPlayerEvent(incomingMessage) && incomingMessage.event.includes('subtitle')) {
			messages.push(incomingMessage);
			if (messages.length > 50) {
				messages.shift();
			}
		}

		if (isPlayerEvent(incomingMessage) && playerOptions.autoNext) {
			const newEpisode = incomingMessage.data?.episode;
			const newSeason = incomingMessage.data?.season;

			const hasEpisodeChanged = newEpisode && newEpisode !== episodeSeed;
			const hasSeasonChanged = newSeason && newSeason !== seasonSeed;

			if ((hasEpisodeChanged || hasSeasonChanged) && !isPlayerNavigating) {
				isPlayerNavigating = true;

				const seasonToNavigate = newSeason ?? seasonSeed;
				const episodeToNavigate = newEpisode ?? 1;

				await updateURL(seasonToNavigate, episodeToNavigate);

				if (!nodes.has(seasonToNavigate)) {
					await invalidate('app:episodes');
				}

				isPlayerNavigating = false;
			}
		}
	}

	function handleSeasonMark() {
		const episodesRange = Array.from(Array(seasonEdges.length), (_, index) => index + 1);
		historyStorage.markEpisodes(params.id, seasonSeed, episodesRange);
	}

	$effect(() => {
		const builderOptions = {
			autoNext: playerOptions.autoNext,
			autoPlay: playerOptions.autoPlay,
			autoSubtitles: playerOptions.autoSubtitles,
			season: seasonSeed,
			episode: episodeSeed,
		};

		const currentId = params.id;

		if (untrack(() => isPlayerNavigating)) {
			return;
		}

		iframeSrc = SourceBuilder.build(defaultSource, currentId, builderOptions);
	});

	$effect(() => {
		if (data.seriesEpisodes.seasonEpisodes) {
			const season = untrack(() => seasonSeed);
			nodes.set(season, data.seriesEpisodes.seasonEpisodes.edges);
		}
	});

	$effect(() => {
		if (isNaN(seasonSeed) || isNaN(episodeSeed)) return;

		// Initialize or update history entry
		const entry = {
			posterUrl: data.seriesMeta?.primaryImage?.url || '',
			title,
			titleType: 'tvSeries' as const,
			releaseYear: year || 0,
			rating: data.seriesMeta?.ratingsSummary?.aggregateRating || 0,
			genres: data.seriesMeta.titleGenres?.genres?.map((g) => g.genre.text) || [],
			totalEpisodes: data.seriesMeta.episodes?.allEpisodesTotal?.total || 0,
			totalSeasons: data.seriesMeta.episodes?.seasons?.length || 0,
		};

		historyStorage.init(params.id, entry);
		historyStorage.markEpisodes(params.id, seasonSeed, episodeSeed);
	});

	onMount(async () => {
		const urlParams = page.url.searchParams;

		if (!urlParams.has('season') || !urlParams.has('episode')) {
			await updateURL(seasonSeed, episodeSeed);
		}
	});
</script>

<svelte:window onmessage={handleMessage} />

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<div class="container mx-auto flex flex-col justify-center py-4">
	<div class="relative mx-auto w-full overflow-hidden rounded-lg bg-surface">
		<iframe
			bind:this={iframeRef}
			title={`${title}${year ? ` (${year})` : ''} — player`}
			src={iframeSrc}
			class="aspect-video"
			loading="lazy"
			referrerpolicy="no-referrer"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen;"
			allowfullscreen
		></iframe>

		<div
			class="pointer-events-none"
			{@attach outsideClick(() => {
				isServersMenuActive = false;
			})}
		>
			<button
				class="pointer-events-auto absolute top-3 right-3 flex cursor-pointer items-center gap-x-1 rounded-md bg-brand-primary-150/15 px-2.5 py-1.5
           text-xs text-white ring-1 ring-white/20 backdrop-blur hover:bg-brand-primary-150/25"
				onclick={() => (isServersMenuActive = !isServersMenuActive)}
				aria-haspopup="menu"
				aria-expanded={isServersMenuActive}
			>
				<Icon.Linear.Server class="size-6 shrink-0 fill-brand-primary-150/75" />
				Servers
			</button>

			{#if isServersMenuActive}
				<div
					role="menu"
					class="pointer-events-auto absolute top-14 right-3 z-10 w-48 overflow-hidden rounded-lg
             bg-brand-primary-150/15 shadow-2xl ring-2 ring-white/10 backdrop-blur-2xl"
				>
					{#each Object.keys(SourceBuilder.ORIGINS) as key (key)}
						<button
							role="menuitem"
							class="w-full cursor-pointer rounded-md p-3 px-3 py-2 text-left text-sm hover:bg-brand-primary-150/25"
							onclick={() => {
								defaultSource = key as keyof typeof SourceBuilder.ORIGINS;
								isServersMenuActive = false;
							}}
						>
							{capitalize(key)}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="media-container mt-4 gap-4">
		<div class="Menu-Bar grid gap-3 sm:grid-cols-[auto_1fr_10rem] lg:grid-cols-[20rem_1fr_17.625rem]">
			<div class="">
				<OptionsDropdown
					bind:isMenuOpen={isPlayerSettingsMenuActive}
					bind:items={playerOptions}
					keyWrapper={(key) => {
						return key.toLowerCase().startsWith('auto') ? capitalize(key).split('').toSpliced(4, 0, ' ').join('') : capitalize(key);
					}}
				>
					<Icon.Linear.Gear class="size-6 fill-brand-primary-150/75" />
					<span>Player settings</span>
				</OptionsDropdown>
			</div>
			<button
				type="button"
				class="flex w-full cursor-pointer items-center justify-center gap-x-2
			       rounded-md bg-brand-primary-150/15 px-3 py-2 text-sm text-primary
			       shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-brand-primary-150/25 hover:text-neutral-200 hover:[&>svg]:fill-neutral-200"
				onclick={handleSeasonMark}
			>
				<Icon.Linear.Eye class="inline-block size-6 shrink-0 fill-[#c9d3ee]" />
				Mark Season as Seen
			</button>

			<DropdownMenu
				items={seasons}
				keyProp="number"
				bind:isMenuOpen={isSeasonMenuActive}
				label="Season"
				fallback="No seasons available."
				onSelect={(season) => updateSeason(season.number)}
			>
				Season {seasonSeed}
			</DropdownMenu>
		</div>

		<div class="Media-Poster">
			<MediaCard
				posterUrl={data.seriesMeta?.primaryImage?.url ?? ''}
				{title}
				genres={data.seriesMeta.titleGenres.genres
					.map((g) => g.genre.text)
					.slice(0, 3)
					.join(' • ')}
				rating={data.seriesMeta?.ratingsSummary?.aggregateRating ?? `N/A`}
			/>
		</div>

		<article class="Plot mt-2 max-sm:text-center">
			<h1 class="text-3xl font-bold">{episodesForUI[episodeSeed - 1]?.node.titleText.text}</h1>
			<p class="ml-1 text-sm text-primary">
				{episodePlot}
			</p>
		</article>

		<div class="Episodes">
			<div class="relative mx-1">
				<h3 class="text-primary">List of episodes:</h3>
				<EpisodesMenu
					bind:isMenuOpen={isEpisodeMenuActive}
					threshold={CHUNK}
					{totalEpisodes}
					currentRange={currentRangeLabel}
					ranges={episodeRanges}
					onRangeSelect={(idx) => {
						episodeChunk = idx;
					}}
				/>
			</div>

			<div class="mt-1 ml-0.5 grid grid-cols-[repeat(6,2.5rem)] gap-2">
				{#each episodesForUI as episodeNode (episodeNode.node.id)}
					{@const episode = episodeNode.node}
					{@const episodeNumber = episode.series.episodeNumber.episodeNumber}
					{@const isEntryCurrentEpisode = episodeNumber === episodeSeed}
					<button
						type="button"
						onclick={() => updateEpisode(episodeNumber)}
						class={`size-10 cursor-pointer rounded border-neutral-600 text-primary/40 ring-[1.5px] ring-transparent ring-offset-[1.5px] ring-offset-neutral-850
						${isEntryCurrentEpisode ? 'bg-brand-primary-200 text-white' : historyStorage.isEpisodeWatched(params.id, seasonSeed, episodeNumber) ? 'bg-brand-yellow-80/50 text-[#141312]!' : 'bg-[#171926] hover:ring-neutral-500'}
						text-center align-middle leading-10 font-semibold`}
					>
						{episodeNumber}
					</button>
				{:else}
					<Loader class="mt-2 ml-4" />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.media-container {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-areas:
			'Menu-Bar Menu-Bar Menu-Bar'
			'Media-Poster Plot Episodes';
	}

	.Plot {
		grid-area: Plot;
	}
	.Episodes {
		grid-area: Episodes;
	}
	.Media-Poster {
		grid-area: Media-Poster;
	}
	.Menu-Bar {
		grid-area: Menu-Bar;
	}

	@media (width <= 1024px) {
		.media-container {
			grid-template-areas:
				'Menu-Bar Menu-Bar Menu-Bar'
				'Plot Plot Plot'
				'Media-Poster Episodes Episodes';
		}
	}

	@media (width <= 640px) {
		.media-container {
			justify-items: center;
			grid-template-areas:
				'Menu-Bar Menu-Bar Menu-Bar'
				'Episodes Episodes Episodes'
				'Media-Poster Media-Poster Media-Poster'
				'Plot Plot Plot';
		}

		.Menu-Bar {
			justify-self: stretch;
			margin-inline: 1rem;
		}
	}
</style> -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import EpisodeRating from '$lib/core/ui/EpisodeRating.svelte';
	import Rating from '$lib/core/ui/Rating.svelte';
	import { getResizedImage } from '$lib/features/media/logic/image';
	import { isReleased } from '$lib/features/media/utils/release';
	import { Icon } from '$lib/icons';
	import { fly } from 'svelte/transition';
	import { buildSourceUrl } from '$lib/features/player/logic/sources/registry';
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
	}
</script>

<svelte:head>
	<title>BossFlix • {data.series.metadata.title}</title>
</svelte:head>

<div class="container mx-auto my-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem]">
	<article>
		<h1 class="mb-2 text-3xl font-black md:text-4xl">{data.series.metadata.title}</h1>
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
		<iframe
			title={`${data.series.metadata.title}${data.series.metadata.releaseDate?.year ? ` (${data.series.metadata.releaseDate.year})` : ''} — player`}
			src={iframeSrc}
			class="mx-auto mb-6 aspect-video w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
			loading="lazy"
			referrerpolicy="no-referrer"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen;"
			allowfullscreen
		></iframe>
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
										'size-4 group-hover:fill-gray-400',
										isEpisodeActive || !isEpisodeReleased ? 'fill-gray-400' : 'fill-gray-500',
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
