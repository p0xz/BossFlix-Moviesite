<script lang="ts">
	import type { PageProps } from './$types';
	import type { PlayerMessageEmitter } from '$lib/types';
	import type { sourceOrigins } from '$lib/utils/sources';
	import { isPlayerEvent, playerJsMessageEmitter } from '$lib/utils/videoPlayer';
	import { type Imdb } from '$lib/types';
	import { page } from '$app/state';
	import { onMount, untrack } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { goto, invalidate } from '$app/navigation';
	import { capitalize, fixDigits, outsideClick, SourceBuilder, historyStorage } from '$lib';
	import { EpisodesMenu, Loader, MediaCard, DropdownMenu, OptionsDropdown } from '$lib/components/ui';
	import { Icon } from '$lib/icons';

	let { data, params }: PageProps = $props();

	const CHUNK = 30;
	const title = data?.seriesMeta?.originalTitleText?.text ?? 'Untitled';
	const year = data.seriesMeta?.releaseDate?.year;

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
	const seasons = $derived(data?.seriesMeta?.episodes?.seasons ?? []);

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
		historyStorage.markEpisode(params.id, seasonSeed, episodesRange);
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

		historyStorage.init(params.id, false);
		historyStorage.markEpisode(params.id, seasonSeed, episodeSeed);
	});

	onMount(async () => {
		const urlParams = page.url.searchParams;

		if (!urlParams.has('season') || !urlParams.has('episode')) {
			await updateURL(seasonSeed, episodeSeed);
		}

		if (historyStorage.totalEpisodes(params.id) === 0 || historyStorage.areEntriesEmpty(params.id)) {
			historyStorage.setEntries(params.id, {
				posterUrl: data.seriesMeta?.primaryImage?.url || '',
				title,
				releaseYear: year,
				titleType: 'series',
				rating: data.seriesMeta?.ratingsSummary?.aggregateRating || 0,
				genres: data.seriesMeta.titleGenres?.genres?.map((g) => g.genre.text) || [],
				totalEpisodes: data.seriesMeta.episodes?.allEpisodesTotal?.total || 0,
				totalSeasons: data.seriesMeta.episodes?.seasons?.length || 0,
			});
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
		<!-- <button
			type="button"
			class=" flex cursor-pointer items-center gap-x-1 rounded-md bg-brand-primary-150/15 px-2.5 py-1.5
	   text-xs text-white ring-1 ring-white/20 backdrop-blur hover:bg-brand-primary-150/25"
			onclick={() => {
				playerJsMessageEmitter(iframeRef?.contentWindow, 'subtitles');
			}}
		>
			Subtitle experiment
		</button>
		{JSON.stringify(messages, null, 2)} -->

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
	<!-- {JSON.stringify(messages, null, 2)} -->
	<!-- TODO: Complete css overhaul this is painful to look at -->
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
						${isEntryCurrentEpisode ? 'bg-brand-primary-200 text-white' : historyStorage.isEpisodeMarked(params.id, seasonSeed, episodeNumber) ? 'bg-brand-yellow-80/50 text-[#141312]!' : 'bg-[#171926] hover:ring-neutral-500'}
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
</style>
