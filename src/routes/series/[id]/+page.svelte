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
	import { capitalize, fixDigits, outsideClick, SourceBuilder, watchedStore } from '$lib';
	import { EpisodesMenu, Loader, MediaCard, DropdownMenu, OptionsDropdown } from '$lib/components/ui';
	import { Icon } from '$lib/icons';

	let { data, params }: PageProps = $props();

	const CHUNK = 30;
	const title = data?.seriesMeta?.originalTitleText?.text ?? 'Untitled';
	const year = data.seriesMeta?.releaseDate?.year;
	const searchParams = Object.fromEntries(page.url.searchParams.entries()) as {
		season?: string;
		episode?: string;
	};

	type EdgeList = Imdb.Series['episodes']['seasonEpisodes']['edges'];
	const nodes = new SvelteMap<number, EdgeList>();

	let entry = $state({
		season: Math.max(Number(page.url.searchParams.get('season')) || 1),
		episode: Math.max(Number(page.url.searchParams.get('episode')) || 1),
	});

	let defaultSource = $state<sourceOrigins>('vidsrc');

	let playerOptions = $state({
		autoPlay: true,
		autoNext: true,
		autoSubtitles: false,
	});

	let isSeasonMenuActive = $state(false);
	let isEpisodeMenuActive = $state(false);
	let isServersMenuActive = $state(false);
	let isPlayerSettingsMenuActive = $state(false);

	let iframeSrc = $derived.by(() => {
		return SourceBuilder.build(defaultSource, params.id, {
			autoNext: playerOptions.autoNext,
			autoPlay: playerOptions.autoPlay,
			autoSubtitles: playerOptions.autoSubtitles,
			season: entry.season,
			episode: entry.episode,
		});
	});

	let episodeChunk = $derived(Math.max(0, Math.floor((entry.episode - 1) / CHUNK)));

	let iframeRef = $state<HTMLIFrameElement>();

	const seasonEdges = $derived(nodes.get(entry.season) ?? []);
	const totalEpisodes = $derived(seasonEdges.length);
	const chunkCount = $derived(Math.ceil(totalEpisodes / CHUNK));
	const currentEpisodeNode = $derived.by(() => {
		return seasonEdges.find((e) => {
			const epNumber = e.node.series.episodeNumber.episodeNumber;
			return epNumber === entry.episode;
		})?.node;
	});
	const episodePlot = $derived(currentEpisodeNode?.plots?.edges?.[0]?.node?.plotText?.plainText);
	const seasons = $derived(data?.seriesMeta?.episodes?.seasons ?? []);

	const episodesForUI = $derived.by<EdgeList>(() => {
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
		if (entry.episode === episode) return;

		if (Number.isInteger(entry.episode / CHUNK)) {
			episodeChunk += 1;
		}

		watchedStore.markEpisode(params.id, entry.season, [entry.episode, episode]);

		entry.episode = episode;

		updateURL(entry.season, entry.episode);
	}

	async function updateSeason(season: number) {
		if (entry.season === season) {
			isSeasonMenuActive = false;
			return;
		}

		entry.season = season;
		entry.episode = 1;
		isSeasonMenuActive = false;

		watchedStore.init(params.id, entry.season);
		watchedStore.markEpisode(params.id, entry.season, entry.episode);

		await updateURL(entry.season, entry.episode);

		if (!nodes.has(season)) {
			invalidate('app:episodes');
		}
	}

	$effect(() => {
		if (data.seriesEpisodes.seasonEpisodes) {
			const season = untrack(() => entry.season);

			nodes.set(season, data.seriesEpisodes.seasonEpisodes.edges);
			console.log(nodes);
		}
	});

	onMount(async () => {
		if (!searchParams.season || !searchParams.episode) {
			updateURL(entry.season, entry.episode);
		}

		watchedStore.init(params.id, entry.season).markEpisode(params.id, entry.season, entry.episode);

		if (watchedStore.totalEpisodes(params.id) === 0 || watchedStore.areEntriesEmpty(params.id)) {
			watchedStore.setEntries(params.id, {
				posterUrl: data.seriesMeta?.primaryImage?.url || '',
				title,
				releaseYear: year,
				titleType: 'series',
				rating: data.seriesMeta?.ratingsSummary?.aggregateRating || 0,
				genres: data.seriesMeta.titleGenres.genres.map((g) => g.genre.text) || [],
				totalEpisodes: data.seriesMeta.episodes.allEpisodesTotal.total || 0,
				totalSeasons: data.seriesMeta.episodes.seasons?.length || 0,
			});
		}
	});

	function handleMessage(
		event: MessageEvent<any> & {
			currentTarget: EventTarget & Window;
		},
	) {
		const incomingMessage = <PlayerMessageEmitter.PlayerJS.PlayerEventData>event.data;

		const isEventSubtitle =
			!isPlayerEvent(incomingMessage) && (incomingMessage.event === 'subtitle' || incomingMessage.event === 'subtitles');

		if (isEventSubtitle && incomingMessage.data !== 'off' && !playerOptions.autoSubtitles && defaultSource === 'vidsrc') {
			playerJsMessageEmitter(iframeRef?.contentWindow, 'subtitle', -1);
		}

		if (isPlayerEvent(incomingMessage) && incomingMessage.data.episode !== entry.episode && playerOptions.autoNext) {
			updateEpisode(incomingMessage.data?.episode ?? entry.episode);

			if (incomingMessage.data?.season === entry.season) return;

			const season = incomingMessage.data?.season ?? entry.season;

			updateSeason(season);
		}
	}
</script>

<svelte:window onmessage={handleMessage} />

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<div class="container mx-auto flex flex-col justify-center py-4">
	<header class="self-center">
		<a href="/">
			<h1 class="mb-4 justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
		</a>
	</header>
	<div class="relative w-full overflow-hidden rounded-lg bg-surface">
		<iframe
			bind:this={iframeRef}
			title={`${title}${year ? ` (${year})` : ''} — player`}
			src={iframeSrc}
			class="aspect-video"
			loading="lazy"
			referrerpolicy="no-referrer"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
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

	<div class="grid grid-cols-[auto_1fr_auto] gap-x-4 sm:grid-cols-[auto_1fr_15rem]">
		<div class="col-span-full mb-4 grid grid-cols-subgrid items-center gap-3">
			<div class="col-span-1 row-start-2 space-x-1">
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

			<div class="col-start-3 row-start-2 flex h-full w-full justify-center gap-x-2">
				<DropdownMenu
					items={seasons}
					keyProp="number"
					bind:isMenuOpen={isSeasonMenuActive}
					label="Season"
					fallback="No seasons available."
					onSelect={(season) => updateSeason(season.number)}
				>
					Season {entry.season}
				</DropdownMenu>
			</div>
		</div>

		<div
			class="grid grid-cols-subgrid gap-y-4 max-sm:col-span-3 max-sm:row-start-3 max-sm:mt-4 max-xs:grid-rows-[auto_auto] max-xs:gap-y-4 2md:col-span-2"
		>
			<MediaCard
				posterUrl={data.seriesMeta?.primaryImage?.url ?? ''}
				{title}
				genres={data.seriesMeta.titleGenres.genres
					.map((g) => g.genre.text)
					.slice(0, 3)
					.join(' • ')}
				rating={data.seriesMeta?.ratingsSummary?.aggregateRating ?? `N/A`}
			/>
			<div class="mt-2">
				<h1 class="text-4xl font-bold">{title}</h1>
				<p class="ml-1 text-sm text-primary">
					{#if episodePlot?.length}
						{episodePlot}
					{:else}
						<Loader class="mt-2 ml-12" />
					{/if}
				</p>
			</div>
		</div>

		<div class="col-start-1 max-sm:col-span-3 sm:col-start-3">
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

			<div class="mt-1 ml-0.5 flex flex-wrap gap-2">
				{#each episodesForUI as episodeNode (episodeNode.node.id)}
					{@const episode = episodeNode.node}
					{@const episodeNumber = episode.series.episodeNumber.episodeNumber}
					{@const isEntryCurrentEpisode = episodeNumber === entry.episode}

					<button
						type="button"
						onclick={() => updateEpisode(episodeNumber)}
						class={`size-10 cursor-pointer rounded border-neutral-600 text-primary/40 ring-[1.5px] ring-transparent ring-offset-[1.5px] ring-offset-neutral-850
						${isEntryCurrentEpisode ? 'bg-brand-primary-200 text-white' : watchedStore.isEpisodeMarked(params.id, entry.season, episodeNumber) ? 'bg-brand-yellow-80/50 text-[#141312]!' : 'bg-[#171926] hover:ring-neutral-500'}
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
