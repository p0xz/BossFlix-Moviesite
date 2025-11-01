<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { onMount, untrack } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { goto, invalidate } from '$app/navigation';

	import { fixDigits, truncate, watchedStore, type Imdb } from '$lib';
	import { Switch, ImdbLogo, SeasonMenu, EpisodesMenu, Loader } from '$lib/components/ui';

	type Binary = 1 | 0;
	interface PlayerOptions {
		autoPlay: Binary;
		autoNext: Binary;
		autoSubtitles: string;
	}

	let { data, params }: PageProps = $props();

	const CHUNK = 30;
	const TARGET_ORIGIN = 'https://vidsrc-embed.ru';
	const title = data?.seriesMeta?.originalTitleText?.text ?? 'Untitled';
	const year = data.seriesMeta?.releaseDate?.year;
	const searchParams = Object.fromEntries(page.url.searchParams.entries()) as {
		season?: string;
		episode?: string;
	};

	type EdgeList = Imdb.Series['episodes']['episodes']['edges'];
	let nodes = new SvelteMap<number, EdgeList>();

	let entry = $state({
		season: Math.max(Number(searchParams?.season) || 1),
		episode: Math.max(Number(searchParams?.episode) || 1),
	});
	let playerOptions = $state<PlayerOptions>({
		autoPlay: 1,
		autoNext: 1,
		autoSubtitles: '',
	});

	let iframeSrc = $state('');
	let isSeasonMenuActive = $state(false);
	let isEpisodeMenuActive = $state(false);
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
		totalEpisodes
			? `${fixDigits(episodeChunk * CHUNK + 1)}-${Math.min((episodeChunk + 1) * CHUNK, totalEpisodes)}`
			: '',
	);

	function buildMediaSource(id: string, season: number, episode: number) {
		return `${TARGET_ORIGIN}/embed/tv?imdb=${id}&season=${season}&episode=${episode}&autonext=${playerOptions.autoNext}&autoplay=${playerOptions.autoPlay}${playerOptions.autoSubtitles ? `&ds_lang=${playerOptions.autoSubtitles}` : ''}`;
	}

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
		episodeChunk = 0;
		isSeasonMenuActive = false;
		await updateURL(entry.season, entry.episode);

		if (!nodes.has(season)) {
			invalidate('app:episodes');
		}
	}

	$effect(() => {
		if (data.seriesEpisodes.episodes) {
			const season = untrack(() => entry.season);

			nodes.set(season, data.seriesEpisodes.episodes.edges);
		}
	});

	onMount(() => {
		if (!searchParams.season || !searchParams.episode) {
			updateURL(entry.season, entry.episode);
		}

		if (data.seriesEpisodes?.episodes?.edges) {
			nodes.set(entry.season, data.seriesEpisodes.episodes.edges);
		}

		iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);

		watchedStore.init(params.id, entry.season);
	});
</script>

<svelte:window
	onmessage={(event) => {
		interface EventData {
			type: 'PLAYER_EVENT';
			data?: {
				imdbId: string;
				tmdbId: number;
				type: string;
				season: number;
				episode: number;
				currentTime: number;
				duration: number;
				data?: string;
				// There are more events, but just added these for now since I don't see a point to add more
				// event: 'ended' | 'end' | 'finished' | 'pause' | 'paused' | 'fileend' | 'subtitle';
			};
			event:
				| 'ended'
				| 'end'
				| 'finished'
				| 'pause'
				| 'paused'
				| 'fileend'
				| 'subtitle'
				| 'subtitles';
		}

		const eventData = <EventData>event.data;

		const playerData = eventData?.data?.data;

		if (
			(eventData.event === 'subtitles' || eventData.event === 'subtitle') &&
			playerData?.length &&
			playerData.toLowerCase() !== 'off' &&
			!playerOptions.autoSubtitles.length
		) {
			iframeRef?.contentWindow?.postMessage({ api: 'subtitle', set: -1 }, TARGET_ORIGIN);
		}

		if (eventData?.type !== 'PLAYER_EVENT' || !eventData?.data) return;

		if (eventData.data?.episode !== entry.episode && playerOptions.autoNext) {
			if (eventData.data?.season !== entry.season) {
				watchedStore.init(params.id, eventData.data.season);
				watchedStore.markEpisode(params.id, eventData.data.season, 1);
				updateSeason(eventData.data.season);
			}

			watchedStore.markEpisode(params.id, entry.season, entry.episode);
			updateEpisode(eventData.data?.episode);
		}
	}}
/>

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<div class="mx-auto flex w-[90%] max-w-5xl flex-col justify-center py-4">
	<header class="self-center">
		<a href="/">
			<h1 class="mb-4 justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
		</a>
	</header>
	<div class="aspect-video w-full overflow-hidden rounded-lg bg-surface">
		<!-- <iframe
			bind:this={iframeRef}
			title={`${title}${year ? ` (${year})` : ''} — player`}
			src={iframeSrc}
			class="h-full w-full"
			loading="lazy"
			referrerpolicy="origin"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe> -->
	</div>

	<div class="grid grid-cols-[auto_1fr_auto] gap-x-4 sm:grid-cols-[auto_1fr_15rem]">
		<div
			class="col-span-full my-4 grid grid-cols-subgrid items-center gap-2 max-sm:grid-rows-2 sm:flex-row sm:justify-between"
		>
			<div
				class="col-span-2 grid-cols-2 gap-x-4 text-center max-md:grid max-sm:col-span-full sm:ms-auto"
			>
				<Switch
					condition={Boolean(playerOptions.autoSubtitles.length)}
					event={() => {
						if (playerOptions.autoSubtitles.length) {
							playerOptions.autoSubtitles = '';
							iframeRef?.contentWindow?.postMessage({ api: 'subtitle', set: -1 }, TARGET_ORIGIN);
						} else {
							iframeRef?.contentWindow?.postMessage({ api: 'subtitle', set: 0 }, TARGET_ORIGIN);
							playerOptions.autoSubtitles = 'en';
							iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
						}
					}}
				>
					Auto Subtitles
					<span
						class="text-brand-yellow-100"
						title="Due to issues that are caused by bad timestamped subtitles this feature is marked as an experimental"
					>
						(experimental)
					</span>
				</Switch>
				<Switch
					condition={playerOptions.autoNext === 1}
					event={() => {
						if (playerOptions.autoNext === 1) playerOptions.autoNext = 0;
						else playerOptions.autoNext = 1;

						iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
					}}
				>
					Auto Next
				</Switch>
			</div>

			<SeasonMenu
				{seasons}
				bind:isMenuOpen={isSeasonMenuActive}
				currentSeason={entry.season}
				onSeasonSelect={(season) => {
					watchedStore.init(params.id, season);
					watchedStore.markEpisode(params.id, season, 1);
					updateSeason(season);
					iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
				}}
			/>
		</div>

		<div
			class="grid grid-cols-subgrid gap-y-4 max-sm:col-span-3 max-sm:row-start-3 max-sm:mt-4 max-xs:grid-rows-[auto_auto] max-xs:gap-y-4 2md:col-span-2"
		>
			<img
				src={data.seriesMeta?.primaryImage?.url}
				draggable="false"
				alt={title}
				class="w-58 object-cover max-2md:order-2 max-2md:mt-4 max-sm:col-start-1 max-sm:mt-0 max-xs:row-start-2"
			/>
			<div class="max-xs:col-span-full">
				<h2 class="text-[clamp(1.25rem,3vw+1rem,2rem)] font-medium">{title}</h2>
				<div class="flex text-center">
					<ImdbLogo class="h-8 w-16" />
					<span
						class="inline-block w-16 rounded-r-sm bg-brand-primary-150/15 py-0.5 text-lg font-semibold"
					>
						{data.seriesMeta?.ratingsSummary?.aggregateRating}
					</span>
				</div>
				<p class="mt-2 ml-0.5 text-sm text-primary">
					{#if episodePlot?.length}
						{truncate(episodePlot, 450)}
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
						onclick={() => {
							watchedStore.markEpisode(params.id, entry.season, entry.episode);
							updateEpisode(episodeNumber);
							watchedStore.markEpisode(params.id, entry.season, episodeNumber);

							iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
						}}
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

<style global>
	.loader {
		width: 2rem;
		height: 2rem;
		display: inline-block;
		border-radius: 50%;
		position: relative;
		animation: rotate 1s linear infinite;
	}
	.loader::before {
		content: '';
		position: absolute;
		inset: 0px;
		border-radius: 50%;
		border: 5px solid #fff;
		animation: prixClipFix 2s linear infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes prixClipFix {
		0% {
			clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
		}
		25% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
		}
		50% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
		}
		75% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
		}
		100% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
		}
	}
</style>
